export async function onRequest(context) {
  // index.html ni GET yoki POST bilan qaytarish
  const url = new URL(context.request.url);

  // static asset'ni olish
  const assetUrl = new URL("/index.html", url.origin);

  const response = await fetch(assetUrl, {
    method: "GET",
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
  });

  return new Response(await response.text(), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy":
        "frame-ancestors https://*.bitrix24.kz https://*.bitrix24.com;",
    },
  });
}
