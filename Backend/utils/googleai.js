import "dotenv/config";

const GoogleAIAPIResponse = async (message) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    const data = await response.json();

    // console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return reply || "No response from Gemini";
  } catch (err) {
    console.error("Gemini API error:", err);
    return "Error generating response";
  }
};

export default GoogleAIAPIResponse;
