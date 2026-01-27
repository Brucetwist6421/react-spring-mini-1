/* eslint-disable @typescript-eslint/no-explicit-any */
export const TYPE_MAP: { [key: string]: string } = {
  normal: "노말", fire: "불꽃", water: "물", grass: "풀", electric: "전기", ice: "얼음",
  fighting: "격투", poison: "독", ground: "땅", flying: "비행", psychic: "에스퍼",
  bug: "벌레", rock: "바위", ghost: "고스트", dragon: "드래곤", dark: "악", steel: "강철", fairy: "페어리"
};

export const STAT_LABELS: any = {
  hp: { label: "체력", color: "#ff0000" },
  attack: { label: "공격", color: "#f08030" },
  defense: { label: "방어", color: "#f8d030" },
  "special-attack": { label: "특공", color: "#6890f0" },
  "special-defense": { label: "특방", color: "#78c850" },
  speed: { label: "스피드", color: "#f85888" },
};

export const HABITAT_MAP: { [key: string]: string } = {
  cave: "동굴", forest: "숲", grassland: "풀밭", mountain: "산악", 
  rare: "희귀", sea: "바다", urban: "도심", waters_edge: "물가", rough_terrain: "험지"
};

export const TYPE_STAT_DATA: any = {
  fire: { hp: 69, attack: 84, defense: 67, "special-attack": 88, "special-defense": 71, speed: 74 },
  water: { hp: 70, attack: 74, defense: 71, "special-attack": 74, "special-defense": 70, speed: 65 },
  grass: { hp: 67, attack: 73, defense: 70, "special-attack": 76, "special-defense": 70, speed: 61 },
  electric: { hp: 62, attack: 70, defense: 61, "special-attack": 82, "special-defense": 69, speed: 100 },
  dragon: { hp: 83, attack: 106, defense: 86, "special-attack": 94, "special-defense": 85, speed: 83 },
  normal: { hp: 76, attack: 73, defense: 59, "special-attack": 55, "special-defense": 63, speed: 70 },
  fighting: { hp: 70, attack: 96, defense: 70, "special-attack": 53, "special-defense": 64, speed: 66 },
  rock: { hp: 65, attack: 90, defense: 105, "special-attack": 60, "special-defense": 73, speed: 56 },
  ghost: { hp: 63, attack: 73, defense: 71, "special-attack": 81, "special-defense": 76, speed: 64 },
  steel: { hp: 68, attack: 93, defense: 119, "special-attack": 70, "special-defense": 79, speed: 55 },
  psychic: { hp: 70, attack: 65, defense: 67, "special-attack": 92, "special-defense": 82, speed: 80 },
};