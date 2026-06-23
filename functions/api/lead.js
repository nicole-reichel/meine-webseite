export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { firstname, email } = body;

  if (!firstname || !email || !email.includes("@")) {
    return Response.json({ ok: false, error: "Missing or invalid fields" }, { status: 422 });
  }

  if (env.LEAD_WEBHOOK_URL) {
    try {
      await fetch(env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, email, source: "the-doors-landingpage", ts: Date.now() }),
      });
    } catch {
      // Webhook-Fehler still loggen, aber Lead trotzdem annehmen
    }
  }

  return Response.json({ ok: true, message: "Lead received" }, { status: 200 });
}
