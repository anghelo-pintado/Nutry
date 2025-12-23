export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error("Error al enviar a n8n");
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error n8n:", error);
    return res.status(500).json({ error: "Error interno" });
  }
}
