export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Static fayllarni function "intercept" qilmasin
  if (
    url.pathname === "/index.html" ||
    url.pathname === "/install.html" ||
    url.pathname === "/favicon.ico" ||
    url.pathname.startsWith("/assets/")
  ) {
    return context.next();
  }

  // Bitrix widget ko'pincha POST bilan keladi, biz uni GET index.html ga "rewrite" qilamiz
  if (url.pathname === "/") {
    const rewrittenUrl = new URL("/index.html", url.origin);

    const rewrittenRequest = new Request(rewrittenUrl.toString(), {
      method: "GET",
      headers: context.request.headers,
    });

    return context.next(rewrittenRequest);
  }

  // qolgan hammasi static'ga o'tsin
  return context.next();
}
