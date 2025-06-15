require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.askQuestion = async (req, res) => {
  const { question, topic } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  const prompt = `
You are a helpful AI tutor. Answer this student's question clearly and concisely.
If the topic is provided, relate your answer to that topic.

Topic: ${topic || "General"}
Question: ${question}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.status(200).json({ answer: response });
  } catch (err) {
    res.status(500).json({
      message: "Failed to get AI response",
      error: err.message
    });
  }
};
