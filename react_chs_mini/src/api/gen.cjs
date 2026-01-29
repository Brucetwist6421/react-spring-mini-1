// gen.js
const fs = require('fs');

async function generatePokemonData() {
  console.log("데이터 생성 중... 잠시만 기다려주세요.");
  try {
    // 1. 모든 포켓몬의 종(species) 데이터를 가져와 한글 이름을 추출합니다.
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=2000");
    const data = await response.json();

    const nameMap = {};

    // 2. 각 포켓몬의 상세 한글 이름을 가져옵니다. (병렬 처리)
    await Promise.all(data.results.map(async (item) => {
      const res = await fetch(item.url);
      const detail = await res.json();
      const koName = detail.names.find(n => n.language.name === "ko")?.name;
      if (koName) {
        nameMap[item.name] = koName;
      }
    }));

    // 3. 파일로 저장
    const fileContent = `
export const POKEMON_NAME_MAP: Record<string, string> = ${JSON.stringify(nameMap, null, 2)};

export const POKEMON_OPTIONS = Object.entries(POKEMON_NAME_MAP).map(([en, ko]) => ({
  name: en,
  koName: ko,
}));
    `;

    fs.writeFileSync('pokemonData.ts', fileContent);
    console.log("✅ pokemonData.ts 파일이 성공적으로 생성되었습니다!");
  } catch (e) {
    console.error("에러 발생:", e);
  }
}

generatePokemonData();