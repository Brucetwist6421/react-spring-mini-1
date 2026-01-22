import fetch from "node-fetch";

const API_KEY = process.env.GOOGLE_API_KEY;

async function listModels() {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
  );
  const data = await res.json();
  console.log(data);
}

listModels();