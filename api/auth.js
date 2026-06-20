export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { senha } = await req.json();
    const senhasValidas = (process.env.SENHAS_VALIDAS || "").split(",").map(s => s.trim());

    if (!senha || !senhasValidas.includes(senha)) {
      return new Response(JSON.stringify({ ok: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Token simples: senha + data de hoje (expira a cada dia)
    const hoje = new Date().toISOString().slice(0, 10);
    const token = btoa(`${senha}:${hoje}:${process.env.TOKEN_SECRET || "scriptpro"}`);

    return new Response(JSON.stringify({ ok: true, token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }
}
