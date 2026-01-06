import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === "GET" && req.url === "/api/health") {
        return res.status(200).json({ status: "ok" });
    }

    if (req.method === "POST" && req.url === "/api/auth/register") {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: "Missing data" });
        }

        return res.status(200).json({
            message: "Register success",
            email,
        });
    }

    return res.status(404).json({ message: "Route not found" });
}
