export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Try static assets first
    try {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status !== 404) {
        return assetRes;
      }
    } catch (e) {}

    // 2. API Routes
    if (url.pathname.startsWith("/api/admin/auth")) {
      if (request.method === "POST") {
        try {
          const { email, password } = await request.json();
          const adminEmail = env.ADMIN_EMAIL || "admin@clusterstudio.in";
          const adminPass = env.ADMIN_PASSWORD || "clusteradmin00studio";
          const token = env.ADMIN_TOKEN || "cs-admin-secure-token-2024";

          if (email === adminEmail && password === adminPass) {
            return new Response(JSON.stringify({ token, message: "Login successful" }), {
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify({ error: "Invalid credentials" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
          });
        } catch {
          return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
        }
      }
    }

    // 3. SPA Fallback: If not an API route, serve index.html
    const indexReq = new Request(new URL("/", request.url), request);
    try {
      const indexRes = await env.ASSETS.fetch(indexReq);
      return indexRes;
    } catch {
      return new Response("Cluster Studio - Loading...", {
        headers: { "Content-Type": "text/html" }
      });
    }
  }
};