import { verifyAuthNostr } from "../auth.js";

const authorizationMiddleware = async (req, res, next) => {
  const isAuthorized = await verifyAuthNostr(req, process.env.NPUB);
  if (!isAuthorized) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

export { authorizationMiddleware };
