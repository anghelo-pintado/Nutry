export async function enviarAN8N(payload) {
  const res = await fetch("/api/enviar-n8n", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error enviando datos a la API");
  }

  return res.json();
}
