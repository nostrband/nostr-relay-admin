import { nip19 } from "@nostrband/nostr-tools";

export async function verifyAuthNostr(req, npub) {
  try {
    const { type, data: pubkey } = nip19.decode(npub);
    if (type !== "npub") return false;

    const { authorization } = req.headers;
    if (!authorization.startsWith("Nostr ")) return false;
    const data = authorization.split(" ")[1].trim();
    if (!data) return false;
    const json = atob(data);
    const event = JSON.parse(json);
    // console.log("req authorization event", event);

    const now = Math.floor(Date.now() / 1000);
    if (event.pubkey !== pubkey) return false;
    if (event.kind !== 27235) return false;
    if (event.created_at < now - 60 || event.created_at > now + 60)
      return false;
    const u = event.tags.find((t) => t.length === 2 && t[0] === "u")?.[1];
    const method = event.tags.find(
      (t) => t.length === 2 && t[0] === "method",
    )?.[1];
    const payload = event.tags.find(
      (t) => t.length === 2 && t[0] === "payload",
    )?.[1];
    // console.log({ u, method, payload })

    if (req.rawBody) {
      if (req.rawBody.length > 0) {
        const hash = digest("sha256", req.rawBody.toString());
        // console.log({ hash, payload, body: req.rawBody.toString() })
        if (hash !== payload) return false;
      } else if (payload) {
        return false;
      }
    }

    return true;
  } catch (e) {
    console.log("auth error", e);
    return false;
  }
}
