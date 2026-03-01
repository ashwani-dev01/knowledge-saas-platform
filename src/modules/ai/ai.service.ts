import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const headers = {
  Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:8000",
  "X-Title": "Knowledge SaaS"
};

// ========================
// 🔹 Summarize Article
// ========================
export const summarizeText = async (content: string) => {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "system",
            content: "You summarize articles clearly in 4-5 sentences."
          },
          {
            role: "user",
            content: `Summarize this article:\n\n${content}`
          }
        ]
      },
      { headers }
    );

    return response.data.choices[0].message.content.trim();

  } catch (error: any) {
    console.log("AI ERROR (Summary):", error.response?.data);
    throw new Error("AI summarization failed");
  }
};

// ========================
// 🔹 Generate Title
// ========================
export const generateTitle = async (content: string) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content:
            "Generate ONE short professional article title. Do not add numbering. Do not add explanations. Return only the title."
        },
        {
          role: "user",
          content: content
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content.trim();
};

// ========================
// 🔹 Generate Tags
// ========================
export const generateTags = async (content: string) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-3-8b-instruct",
      messages: [
        {
          role: "system",
          content:
            "Generate exactly 5 short SEO tags separated by commas. Do not add any explanation."
        },
        {
          role: "user",
          content: content
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content.trim();
};