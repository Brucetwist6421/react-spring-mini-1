import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL = "gemini-2.5-pro";

// 특정 파일 분석 함수
async function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 파일이 존재하지 않습니다: ${filePath}`);
    return;
  }

  const code = fs.readFileSync(filePath, "utf-8");
  const prompt = `다음 파일의 코드를 분석하고 간략히 요약해주세요:\n\n${code}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    if (data.error) {
      console.error(`❌ ${filePath} 분석 오류:`, data.error.message);
    } else {
      console.log(`\n📄 ${filePath} 요약:\n`);
      console.log(data.candidates?.[0]?.content?.parts?.[0]?.text);
    }
  } catch (err) {
    console.error(`❌ ${filePath} 요청 실패:`, err);
  }
}

// 메인 실행
async function run() {
  const inputFiles = process.argv.slice(2);
  if (inputFiles.length === 0) {
    console.log("사용법: node gemini_review_files.js 파일1.js 파일2.jsx ...");
    return;
  }

  for (const file of inputFiles) {
    await analyzeFile(file);
  }
}

run();
