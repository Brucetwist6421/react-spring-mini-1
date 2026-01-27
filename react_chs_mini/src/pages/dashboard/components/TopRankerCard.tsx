/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Paper, Typography, Avatar, Grid } from "@mui/material";

export default function TopRankerCard({ p, rank }: any) {
  const bst = p.stats.reduce((acc: any, cur: any) => acc + cur.base_stat, 0);
  const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
        <Box sx={{ position: 'relative' }}>
          <Avatar src={p.sprites.front_default} sx={{ width: 50, height: 50, bgcolor: '#f8fafc' }} />
          <Box sx={{ position: 'absolute', top: -5, left: -5, bgcolor: colors[rank-1] || '#94a3b8', color: '#fff', px: 0.8, fontSize: '0.6rem', fontWeight: 900 }}>{rank}위</Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" fontWeight={800} sx={{ textTransform: 'capitalize' }}>{p.name}</Typography>
          <Typography variant="caption" color="text.secondary">전투력(BST): {bst}</Typography>
        </Box>
      </Paper>
    </Grid>
  );
}