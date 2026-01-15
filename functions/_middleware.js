export async function onRequest(context) {
  const { request, next } = context;

  // Bitrix iframe ba'zan OPTIONS yuboradi (preflight)
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  // Bitrix placement handler'ni POST bilan ochishi mumkin.
  // Cloudflare Pages static POST'ni 405 qiladi.
  // Shuning uchun POST'ni GET ga aylantirib, index.html'ni beramiz.
  if (request.method === "POST") {
    const url = new URL(request.url);

    // Root bo'lsa index.html'ga rewrite qilamiz
    // (Bitrix ba'zan /?v=... kabi query bilan keladi)
    url.pathname = "/index.html";

    const newReq = new Request(url.toString(), {
      method: "GET",
      headers: request.headers,
    });

    const res = await next(newReq);
    return withHeaders(res);
  }

  // Oddiy GET/HEAD holati
  const res = await next();
  return withHeaders(res);
}

function withHeaders(res) {
  const headers = new Headers(res.headers);

  // Iframe ichida ochilishi uchun (Bitrix ichida)
  // X-Frame-Options bo'lsa olib tashlaymiz (ba'zan platforma qo'shib yuboradi)
  headers.delete("X-Frame-Options");

  // Bitrix domenlari ichida iframe'ga ruxsat
  headers.set(
    "Content-Security-Policy",
    "frame-ancestors https://*.bitrix24.kz https://*.bitrix24.com https://*.bitrix24.ru 'self';"
  );

  // CORS
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "*");

  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}
