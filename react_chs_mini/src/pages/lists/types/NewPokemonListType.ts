// Row 타입 정의
export interface NewPokemonListType {
  id: number;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  gross?: number;
  costs?: number;
  taxRate?: number;
  mainImagePath?: string | null; // 추가
  name?: string | null;
  description?: string | null;
}

