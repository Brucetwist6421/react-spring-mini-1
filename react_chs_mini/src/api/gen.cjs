const fs = require('fs');

async function generatePokemonData() {
  console.log("데이터 생성 중... 잠시만 기다려주세요.");
  try {
    // 1. 모든 포켓몬 종 데이터 호출
    const response = await fetch("https://pokeapi.co/api/v2/pokemon-species?limit=2000");
    const data = await response.json();

    const pokemonList = [];

    // 2. 상세 데이터 추출 (병렬 처리)
    await Promise.all(data.results.map(async (item) => {
      try {
        const res = await fetch(item.url);
        const detail = await res.json();
        
        const koName = detail.names.find(n => n.language.name === "ko")?.name;
        
        if (koName) {
          pokemonList.push({
            id: detail.id,          // 포켓몬 번호 
            name: item.name,        // 영문 이름
            koName: koName          // 한글 이름
          });
        }
      } catch (err) {
        console.error(`${item.name} 데이터 호출 실패:`, err);
      }
    }));

    // 3. 번호(id) 순으로 오름차순 정렬 (데이터 관리 용이성)
    pokemonList.sort((a, b) => a.id - b.id);

    // 4. 파일 저장 형식 구성
    const fileContent = `
export interface PokemonOption {
  id: number;
  name: string;
  koName: string;
}

export const POKEMON_OPTIONS: PokemonOption[] = ${JSON.stringify(pokemonList, null, 2)};

// 빠른 조회를 위한 ID 기반 Map (선택 사항)
export const POKEMON_ID_MAP: Record<number, PokemonOption> = Object.fromEntries(
  POKEMON_OPTIONS.map(p => [p.id, p])
);
    `;

    fs.writeFileSync('pokemonData.ts', fileContent);
    console.log(`✅ 총 ${pokemonList.length}마리의 데이터가 포함된 pokemonData.ts 파일이 생성되었습니다!`);
  } catch (e) {
    console.error("에러 발생:", e);
  }
}

generatePokemonData();