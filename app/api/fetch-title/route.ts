import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Validate URL
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TabDrop/1.0; +https://tabdrop.vercel.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({ title: null }, { status: 200 });
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      // Not an HTML page, return null title
      return NextResponse.json({ title: null }, { status: 200 });
    }

    // Only read the first 50KB to find the title (for performance)
    const reader = response.body?.getReader();
    if (!reader) {
      return NextResponse.json({ title: null }, { status: 200 });
    }

    let html = '';
    const decoder = new TextDecoder();
    const maxBytes = 50 * 1024; // 50KB
    let bytesRead = 0;

    while (bytesRead < maxBytes) {
      const { done, value } = await reader.read();
      if (done) break;
      
      html += decoder.decode(value, { stream: true });
      bytesRead += value.length;

      // Check if we've found the closing </title> tag
      if (html.includes('</title>')) {
        reader.cancel();
        break;
      }
    }

    // Extract title using regex
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      // Decode HTML entities and clean up the title
      const title = decodeHTMLEntities(titleMatch[1].trim());
      return NextResponse.json({ title }, { status: 200 });
    }

    // Try Open Graph title as fallback
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      const title = decodeHTMLEntities(ogTitleMatch[1].trim());
      return NextResponse.json({ title }, { status: 200 });
    }

    return NextResponse.json({ title: null }, { status: 200 });
  } catch (error) {
    console.error('Error fetching page title:', error);
    return NextResponse.json({ title: null }, { status: 200 });
  }
}

function decodeHTMLEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#60;': '<',
    '&#62;': '>',
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'gi'), char);
  }

  // Handle numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));

  return decoded;
}