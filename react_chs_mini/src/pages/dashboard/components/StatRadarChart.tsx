import { Box, Paper, Typography } from "@mui/material";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StatRadarChart({ stats, color, name }: { stats: any[], color: string, name: string }) {
  const data = stats.map((s) => ({
    subject: s.stat.name.toUpperCase(),
    A: s.base_stat
  }));

  return (
    <Paper sx={{ p: 3, height: '100%', borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#64748b' }}>기본 스탯</Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
            <Radar name={name} dataKey="A" stroke={color} fill={color} fillOpacity={0.5} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}