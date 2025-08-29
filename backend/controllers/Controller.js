// controllers/researchController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateResearchResponse = async (req, res) => {
  try {
    const { question, topic, field, depth } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please provide a research question",
      });
    }

    // ========= PROMPTING STRATEGIES =========

      // 1. zero shot prompting

    // const prompt = `
    // You are an AI Research Assistant.
    // Answer the following research question in a structured way.
    // Question: "${question}"

    // Respond strictly in JSON with this format:
    // {
    //   "title": "Short title for the research response",
    //   "summary": "Brief summary (2-3 sentences)",
    //   "key_points": ["Point1", "Point2", "Point3"],
    //   "further_reading": ["Resource1", "Resource2"]
    // }`;

    // ✅ ONE-SHOT
    /*
    const prompt = `
    Example:
    Question: "What are the impacts of climate change on agriculture?"
    Output (JSON): {
      "title": "Climate Change and Agriculture",
      "summary": "Climate change affects crop yields through rainfall changes, heat, and extreme weather.",
      "key_points": [
        "Reduced crop productivity due to heat stress",
        "Shifts in planting and harvesting seasons",
        "Increased risk of pests and diseases"
      ],
      "further_reading": [
        "https://www.ipcc.ch/srccl/",
        "https://www.fao.org/climate-change"
      ]
    }

    Now, answer this question in the same format:
    Question: "${question}"
    Output (JSON):
    `;
    */

    // ✅ MULTI-SHOT
    /*
    const prompt = `
    Example 1:
    Question: "What is Artificial Intelligence?"
    Output (JSON): {
      "title": "Artificial Intelligence Basics",
      "summary": "AI is the simulation of human intelligence in machines that can reason, learn, and act.",
      "key_points": ["Machine Learning", "Neural Networks", "Automation"],
      "further_reading": ["https://www.ibm.com/ai", "https://plato.stanford.edu/entries/artificial-intelligence/"]
    }

    Example 2:
    Question: "Explain Quantum Computing in simple terms"
    Output (JSON): {
      "title": "Quantum Computing Overview",
      "summary": "Quantum computing uses qubits and superposition to solve complex problems faster than classical computers.",
      "key_points": ["Qubits", "Superposition", "Entanglement"],
      "further_reading": ["https://quantum.ibm.com", "https://www.microsoft.com/quantum"]
    }

    Now, answer this:
    Question: "${question}"
    Output (JSON):
    `;
    */

    // ✅ SYSTEM + USER PROMPTING
    /*
    const systemPrompt = `
    You are a helpful AI Research Assistant.
    Always respond strictly in JSON:
    {
      "title": "",
      "summary": "",
      "key_points": [],
      "further_reading": []
    }`;

    const userPrompt = `Research Question: "${question}"`;

    const prompt = systemPrompt + "\n" + userPrompt;
    */

    // // ✅ DYNAMIC PROMPTING
    // let extraContext = "";
    // if (topic) extraContext += ` focusing on ${topic}`;
    // if (field) extraContext += ` in the field of ${field}`;
    // if (depth) extraContext += ` with ${depth} level detail`;

    // const prompt = `
    // You are a research assistant.
    // Answer the following question${extraContext}:
    // "${question}"

    // Respond only in JSON:
    // {
    //   "title": "Short title",
    //   "summary": "2-3 sentence summary",
    //   "key_points": ["Point1", "Point2", "Point3"],
    //   "further_reading": ["Resource1", "Resource2"]
    // }
    // // `;

    // ==========================================================
    // TEMPERATURE (example: more creative answers if enabled)
    // ==========================================================
    
    // const result = await model.generateContent({
    //   contents: [{ role: "user", parts: [{ text: prompt }] }],
    //   generationConfig: { temperature: 0.9 }, // higher = more creative
    // });
    

// Chain of thought prompting
 let prompt = "";
    if (strategy === "cot") {
      prompt = `
      You are an advanced AI Research Assistant.
      Use chain-of-thought reasoning: first, think through the problem step by step.
      Then, provide a final structured JSON output.

      Research Question: "${question}"

      Respond ONLY in JSON with this structure:
      {
        "title": "Short title for the research response",
        "summary": "Brief summary (2-3 sentences)",
        "reasoning_steps": ["Step 1", "Step 2", "Step 3"],
        "key_points": ["Point1", "Point2", "Point3"],
        "further_reading": ["Resource1", "Resource2"]
      }
      `;
    } else {
      // default fallback: zero-shot
      prompt = `
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
    }

    // ========= CALL GEMINI =========
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // STRUCTURED OUTPUT
    // Clean up markdown if present
    
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

module.exports = { generateResearchResponse };
