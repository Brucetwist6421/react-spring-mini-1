// Pokemon 응답 타입 일부만 정의
type PokemonTypeItem = { type: { name: string } };
type PokemonAbilityItem = { ability: { name: string } };
// 실습 2 시작
// 🔹 변경/추가: 서버에서 오는 첨부파일 타입 정의
type PokemonAttachment = { id: number; pokemonId: number; fileName: string };
// 실습 2 끝


export type PokemonData = {
  id : number;
  name: string;
  sprites?: { front_default?: string | null };
  height?: number;
  weight?: number;
  types?: PokemonTypeItem[];
  abilities?: PokemonAbilityItem[];

  // 실습 3 시작
  // 변경/추가: mainImagePath 외 기존에 없던 데이터 추가
  description?: string;
  mainImagePath?: string;
  attachments?: PokemonAttachment[];
  isFavorite?: number; // 0/1
  isPublic?: number;   // 0/1
  isNotify?: number;   // 0/1
  variant?: string;
  type: string;
  // variant 관련 데이터는 따로 없음
  // 실습 3 끝
};

export type FormState = {
  name: string;
  description: string;
  type: string | "";
  height?: number | "";
  weight?: number | "";
  isFavorite: boolean;
  isPublic: boolean;
  isNotify: boolean;
  variant: "normal" | "shiny";
};