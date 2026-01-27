import { Box, Grid, Paper, Typography} from "@mui/material";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

export default function ActionCard({ icon, title, desc, color }: ActionCardProps) {
  return (
    <Grid size={{ xs: 12, sm: 4 }}>
      <Paper 
        sx={{ 
          p: 2, borderRadius: 0, border: '1px solid #e2e8f0', boxShadow: 'none',
          display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer',
          transition: '0.2s', 
          '&:hover': { backgroundColor: '#f1f5f9', borderColor: color, transform: 'translateY(-2px)' }
        }}
      >
        <Box sx={{ 
          p: 1, backgroundColor: `${color}15`, color: color, 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: '4px' 
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
          <Typography variant="caption" color="text.secondary">{desc}</Typography>
        </Box>
      </Paper>
    </Grid>
  );
}