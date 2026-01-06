import express from "express";

const app = express();
app.use(express.json());

app.post("/api/auth/register", (req, res) => {
    res.json({ message: "Register OK from Vercel backend" });
});

export default app;
