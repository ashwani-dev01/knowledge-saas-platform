import axios from "axios";

export const summarizeText = async (content: string) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
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
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:8000",
          "X-Title": "Knowledge SaaS"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error: any) {
    console.log("AI ERROR:", error.response?.data);
    throw new Error("AI summarization failed");
  }
};