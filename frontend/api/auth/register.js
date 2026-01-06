export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    // TEST: chưa dùng DB
    return res.status(200).json({
        message: "Register success",
        user: { name, email }
    });
}
