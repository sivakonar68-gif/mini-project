import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("."));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY.trim()
});
app.post("/api/chat", async (req, res) => {
    try {
        const messages = req.body.messages || [];

        if (!messages.length) {
            return res.status(400).json({
                error: "No message provided."
            });
        }

        const response = await client.responses.create({
            model: "gpt-5",
            instructions: `
You are the AI Tutor for an AI Study Planner.

You are a general-purpose AI tutor and can answer
questions about any normal subject, including:

Computer Science, DBMS, Java, Python, C, C++,
JavaScript, HTML, CSS, SQL, Mathematics, Science,
History, Geography, college subjects, programming,
writing, general knowledge, study planning and more.

Do not limit yourself to a fixed list of subjects.

Explain things clearly and naturally.
For difficult questions, explain step by step.
Use examples when useful.
Keep simple questions concise.
For coding questions, provide working code and explain it.
If you are unsure about something, say so rather than inventing facts.
            `,
            input: messages
        });

        res.json({
            answer: response.output_text
        });

    } catch (error) {
        console.error("AI ERROR:", error);

        res.status(500).json({
            error: "AI Tutor couldn't respond right now."
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`AI Study Planner running at http://localhost:${PORT}`);
});