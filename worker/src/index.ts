export default {
  async fetch(req: Request, env: any) {
    const url = new URL(req.url);

    if (url.pathname === "/api/predict" && req.method === "POST") {
      const auth = req.headers.get("Authorization");
      if (!auth) return json({ error: "로그인 필요" }, 401);

      const token = auth.split(" ")[1];
      const session = await env.DB
        .prepare("SELECT * FROM sessions WHERE token=?")
        .bind(token)
        .first();

      if (!session) return json({ error: "세션 만료" }, 401);

      const form = await req.formData();
      const file = form.get("file");
      if (!file) return json({ error: "파일 없음" }, 400);

      const key = crypto.randomUUID() + ".png";

      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
      });

      const result =
        Math.random() > 0.5
          ? "AI-generated image likely"
          : "Real image likely";

      await env.DB.prepare(
        "INSERT INTO history (user_id, result) VALUES (?, ?)"
      ).bind(session.user_id, result).run();

      return json({ result });
    }

    return new Response("Not Found", { status: 404 });
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
