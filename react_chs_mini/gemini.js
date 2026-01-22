// gemini.js
import fetch from "node-fetch";

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = "gemini-2.5-pro"; // 최신 모델

async function run() {
  const prompt = process.argv.slice(2).join(" ") || "테스트 문장입니다.";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    console.error("❌ API 오류:", data.error.message);
  } else {
    console.log("💡 답변:", data.candidates?.[0]?.content?.parts?.[0]?.text);
  }
}

run();
