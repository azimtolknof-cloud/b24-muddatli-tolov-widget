export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Root / ga POST bilan kelsa ham index.html beramiz
  if (url.pathname === "/") {
    const rewrittenUrl = new URL("/index.html", url.origin);
    const rewrittenRequest = new Request(rewrittenUrl.toString(), {
      method: "GET",
      headers: context.request.headers,
    });

    const resp = await context.next(rewrittenRequest);

    const headers = new Headers(resp.headers);
    headers.set("X-Frame-Options", "ALLOWALL");
    headers.set(
      "Content-Security-Policy",
      "frame-ancestors https://*.bitrix24.kz https://*.bitrix24.com;"
    );
    headers.set("Cache-Control", "no-store"); // keshni o'ldiramiz

    return new Response(resp.body, { status: resp.status, headers });
  }

  // Qolgan statiklar
  return context.next();
}
