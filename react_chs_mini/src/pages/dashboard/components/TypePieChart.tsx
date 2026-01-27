import { Box, Paper, Typography } from "@mui/material";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';
import { TYPE_COLORS } from "../utils/pokemonUtils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TypePieChart({ types }: { types: any[] }) {
  const data = types.map((t) => ({
    name: t.type.name,
    value: 1,
    fill: TYPE_COLORS[t.type.name] || '#94a3b8'
  }));

  return (
    <Paper sx={{ p: 3, height: '100%', borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#64748b' }}>보유 속성 구성</Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none" />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}