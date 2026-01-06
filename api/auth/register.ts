import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Missing data" });
    }

    return res.status(200).json({
        message: "Register success",
        email,
    });
}
