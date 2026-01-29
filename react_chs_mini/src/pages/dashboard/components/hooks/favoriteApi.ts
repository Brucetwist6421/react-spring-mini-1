import axios from 'axios';

export interface FavoriteVO {
  userId: string;
  pokemonId: number;
  pokemonName: string;
  pokemonKoName: string;
}

// 즐겨찾기 상태 변경 (Toggle)
export const toggleFavoriteApi = async (data: FavoriteVO) => {
  const response = await axios.post('http://168.107.51.143:8080/pokemon/toggle', data);
  return response.data; // { isFavorite: boolean, message: string }
};

// 특정 포켓몬의 즐겨찾기 여부 확인 (필요 시)
// export const checkFavoriteApi = async (userId: string, pokemonId: number) => {
//   const response = await axios.get(`/api/favorites/check?userId=${userId}&pokemonId=${pokemonId}`);
//   return response.data;
// };