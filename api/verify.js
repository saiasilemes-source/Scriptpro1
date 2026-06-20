export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { token } = await req.json();
    if (!token) return new Response(JSON.stringify({ ok: false }), { status: 401 });

    const decoded = atob(token);
    const parts = decoded.split(":");
    // partes: senha, data, secret
    const [senha, data, secret] = parts;

    const hoje = new Date().toISOString().slice(0, 10);
    const senhasValidas = (process.env.SENHAS_VALIDAS || "").split(",").map(s => s.trim());
    const secretCorreto = process.env.TOKEN_SECRET || "scriptpro";

    if (
      data === hoje &&
      secret === secretCorreto &&
      senhasValidas.includes(senha)
    ) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ ok: false }), { status: 401 });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }
}
