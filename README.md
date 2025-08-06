# 📚 AI Research Assistant for College Students

An intelligent, GenAI-powered assistant that helps students understand, summarize, and explore academic research papers. This project leverages Prompting, RAG (Retrieval-Augmented Generation), Structured Output, and Function Calling.

---

## 🚀 Features

- 🔍 **Semantic Search (RAG):** Retrieves relevant academic papers using vector similarity.
- 💬 **Prompt-Based Queries:** Ask the assistant to summarize, explain, generate quiz questions, or fetch related work.
- 📊 **Structured Output:** JSON, tables, MCQs, and bullet-point summaries.
- ⚙️ **Function Calling:** Modular function-based responses like `generateCitation()`, `createMCQ()`, etc.
- 📄 **PDF Upload:** Upload research papers and interact with them.
- 📚 **Citation Generator:** Automatically generate citations in APA/MLA formats.

---

## 🧠 How It Works

1. **Prompting**: User interacts with a conversational UI to request information or tasks.
2. **RAG**: The system retrieves related documents using vector embeddings and augments the prompt.
3. **Function Calling**: Based on intent, predefined backend functions are called (e.g., to summarize, create MCQs, etc.)
4. **Structured Output**: Responses are returned in formats like JSON, tables, or formatted text for frontend rendering.
