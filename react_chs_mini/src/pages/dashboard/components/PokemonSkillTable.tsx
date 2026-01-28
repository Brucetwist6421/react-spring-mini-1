/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Box, Chip, Skeleton 
} from "@mui/material";
import { TYPE_COLORS } from "./types/dashboardType";



export default function PokemonMovesTable({ moves }: { moves: any[] }) {
  const [movesWithDetail, setMovesWithDetail] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoveDetails() {
      try {
        setLoading(true);
        // 기술이 너무 많으면 브라우저 과부하가 올 수 있어 상위 50개로 제한 권장
        // const targetMoves = moves.slice(0, 50); 
        
        const detailedMoves = await Promise.all(
          moves.map(async (m: any) => {
            const res = await fetch(m.move.url);
            const data = await res.json();
            return { 
              ...m, 
              koName: data.names.find((n: any) => n.language.name === "ko")?.name,
              type: data.type.name,
              category: data.damage_class.name,
              power: data.power,
              accuracy: data.accuracy
            };
          })
        );
        setMovesWithDetail(detailedMoves);
      } catch (e) {
        console.error("기술 상세 로드 실패", e);
      } finally {
        setLoading(false);
      }
    }

    if (moves.length > 0) fetchMoveDetails();
  }, [moves]);

  const formatName = (name: string) => name.replace(/-/g, " ").toUpperCase();

  return (
    <Paper sx={{ borderRadius: 0, border: "1px solid #e2e8f0", boxShadow: "none" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0", bgcolor: "#f8fafc", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
          습득 가능 기술 목록
        </Typography>
        <Typography variant="caption" color="text.secondary">
          총 {moves.length}개 기술 표시
        </Typography>
      </Box>
      <TableContainer sx={{ maxHeight: 390 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f5f9" }}>기술명</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f5f9" }}>타입</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f5f9" }}>분류</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f5f9" }}>위력/명중</TableCell>
              <TableCell sx={{ fontWeight: 700, bgcolor: "#f1f5f9" }}>학습방법</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton variant="text" height={30} /></TableCell></TableRow>
              ))
            ) : (
              movesWithDetail.map((m: any, idx: number) => {
                const latestDetail = m.version_group_details[0];
                return (
                  <TableRow key={idx} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.875rem" }}>{m.koName}</Typography>
                      <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>{formatName(m.move.name)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={m.type.toUpperCase()} 
                        size="small" 
                        sx={{ bgcolor: TYPE_COLORS[m.type], color: 'white', fontWeight: 800, fontSize: '0.65rem', borderRadius: 1 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ 
                        color: m.category === 'physical' ? '#ef4444' : m.category === 'special' ? '#3b82f6' : '#94a3b8',
                        fontWeight: 700
                      }}>
                        {m.category === 'physical' ? '물리' : m.category === 'special' ? '특수' : '변화'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                        {m.power ?? '-'} / {m.accuracy ?? '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" display="block">
                        {latestDetail.move_learn_method.name}
                      </Typography>
                      {latestDetail.level_learned_at > 0 && (
                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                          Lv. {latestDetail.level_learned_at}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}