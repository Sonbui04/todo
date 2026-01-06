export default function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { email, password, name } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    res.status(200).json({
        message: "Register success",
        user: { email, name }
    });
}
