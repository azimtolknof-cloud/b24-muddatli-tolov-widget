export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Static fayllarni o'z holicha o'tkazamiz
  if (
    url.pathname === "/index.html" ||
    url.pathname === "/install.html" ||
    url.pathname === "/favicon.ico" ||
    url.pathname.startsWith("/assets/")
  ) {
    return context.next();
  }

  // Root / ga POST bilan kelsa ham index.html ni qaytaramiz
  if (url.pathname === "/") {
    const rewrittenUrl = new URL("/index.html", url.origin);
    const rewrittenRequest = new Request(rewrittenUrl.toString(), {
      method: "GET",
      headers: context.request.headers,
    });

    const resp = await context.next(rewrittenRequest);

    // iframe uchun headerlar (Bitrix ichida ochilishi uchun)
    const headers = new Headers(resp.headers);
    headers.set("X-Frame-Options", "ALLOWALL");
    headers.set(
      "Content-Security-Policy",
      "frame-ancestors https://*.bitrix24.kz https://*.bitrix24.com;"
    );

    return new Response(resp.body, { status: resp.status, headers });
  }

  return context.next();
}
