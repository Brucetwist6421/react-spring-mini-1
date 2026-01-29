import axios from 'axios';

export interface FavoriteVO {
  userId: string;
  pokemonId: number;
  pokemonName: string;
  pokemonKoName: string;
}

// 즐겨찾기 상태 변경 (Toggle)
// export const toggleFavoriteApi = async (data: FavoriteVO) => {
//   const response = await axios.post('http://168.107.51.143:8080/pokemon/toggleFavorite', data);
//   return response.data; // { isFavorite: boolean, message: string }
// };

export const toggleFavoriteApi = async (data: FavoriteVO) => {
  console.log("전송 데이터:", data); // 데이터가 제대로 들어오는지 확인
  
  const response = await axios({
    method: 'post',
    url: 'http://168.107.51.143:8080/pokemon/toggleFavorite',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.data;
};

// 특정 포켓몬의 즐겨찾기 여부 확인 (필요 시)
// export const checkFavoriteApi = async (userId: string, pokemonId: number) => {
//   const response = await axios.get(`/api/favorites/check?userId=${userId}&pokemonId=${pokemonId}`);
//   return response.data;
// };