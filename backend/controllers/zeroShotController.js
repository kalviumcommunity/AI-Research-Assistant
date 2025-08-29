// controllers/researchController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const zeroShotResearch = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please provide a research question",
      });
    }

    const prompt = `
    You are an AI Research Assistant.
    Answer the following research question in a structured way.
    Question: "${question}"

    Respond strictly in JSON with this format:
    {
      "title": "Short title for the research response",
      "summary": "Brief summary (2-3 sentences)",
      "key_points": ["Point1", "Point2", "Point3"],
      "further_reading": ["Resource1", "Resource2"]
    }`;

    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // 🧹 Clean up possible markdown formatting from Gemini
    response = response.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch (parseErr) {
      console.error("JSON Parse Error:", response);
      return res.status(500).json({
        success: false,
        message: "Failed to parse Gemini response",
        rawResponse: response,
      });
    }

    res.status(200).json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { zeroShotResearch };
