/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { 
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Typography, Box, Chip, Skeleton, Tooltip 
} from "@mui/material";
import { TYPE_COLORS } from "./types/dashboardType";

export default function PokemonMovesTable({ moves }: { moves: any[] }) {
  const [movesWithDetail, setMovesWithDetail] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoveDetails() {
      try {
        setLoading(true);
        const targetMoves = moves.slice(0, 40); 
        
        const detailedMoves = await Promise.all(
          targetMoves.map(async (m: any) => {
            const moveRes = await fetch(m.move.url);
            const moveData = await moveRes.json();
            
            const typeRes = await fetch(moveData.type.url);
            const typeData = await typeRes.json();

            return { 
              ...m, 
              koName: moveData.names.find((n: any) => n.language.name === "ko")?.name,
              type: moveData.type.name,
              category: moveData.damage_class.name,
              power: moveData.power,
              accuracy: moveData.accuracy,
              doubleDamageTo: typeData.damage_relations.double_damage_to.map((t: any) => t.name),
              halfDamageTo: typeData.damage_relations.half_damage_to.map((t: any) => t.name)
            };
          })
        );
        setMovesWithDetail(detailedMoves);
      } catch (e) {
        console.error("기술 로드 실패", e);
      } finally {
        setLoading(false);
      }
    }

    if (moves.length > 0) fetchMoveDetails();
  }, [moves]);

  // 상성 칩 렌더링 (동그라미 크기 업 + 툴팁 추가)
  const renderTypeCircles = (types: string[]) => (
    <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', maxWidth: 140 }}>
      {types.length > 0 ? types.map((type) => (
        <Tooltip key={type} title={type.toUpperCase()} arrow placement="top">
          <Box 
            sx={{ 
              width: 14,      // 크기 확대
              height: 14,     // 크기 확대
              //borderRadius: '50%', 
              bgcolor: TYPE_COLORS[type], 
              border: '1.5px solid #ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)', // 입체감 추가
              cursor: 'help',
              transition: 'transform 0.1s',
              '&:hover': { transform: 'scale(1.3)' } // 호버 시 살짝 커짐
            }} 
          />
        </Tooltip>
      )) : <Typography sx={{ fontSize: '0.7rem', color: '#cbd5e1' }}>-</Typography>}
    </Box>
  );

  return (
    <Paper sx={{ borderRadius: 0, border: "1px solid #e2e8f0", boxShadow: "none" }}>
      <TableContainer sx={{ maxHeight: 590 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, bgcolor: "#f1f5f9", width: 120 }}>기술명</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: "#f1f5f9", width: 80 }}>타입</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: "#f1f5f9", color: '#059669' }}>강한 상성 (2x)</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: "#f1f5f9", color: '#dc2626' }}>약한 상성 (0.5x)</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: "#f1f5f9", width: 70 }}>분류</TableCell>
              <TableCell sx={{ fontWeight: 800, bgcolor: "#f1f5f9", width: 90 }}>위력/명중</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton height={45} /></TableCell></TableRow>
              ))
            ) : (
              movesWithDetail.map((m: any, idx: number) => (
                <TableRow key={idx} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.85rem", color: '#1e293b' }}>{m.koName}</Typography>
                    <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", letterSpacing: '0.5px' }}>{m.move.name.toUpperCase()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={m.type.toUpperCase()} 
                      size="small" 
                      sx={{ bgcolor: TYPE_COLORS[m.type], color: 'white', fontWeight: 900, fontSize: '0.6rem', height: 18}}
                    />
                  </TableCell>
                  <TableCell>{renderTypeCircles(m.doubleDamageTo)}</TableCell>
                  <TableCell>{renderTypeCircles(m.halfDamageTo)}</TableCell>
                  <TableCell>
                    <Typography sx={{ 
                      fontSize: '0.75rem', fontWeight: 800,
                      color: m.category === 'physical' ? '#ef4444' : m.category === 'special' ? '#3b82f6' : '#64748b' 
                    }}>
                      {m.category === 'physical' ? '물리' : m.category === 'special' ? '특수' : '변화'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                      {m.power ?? '-'}/{m.accuracy ?? '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}