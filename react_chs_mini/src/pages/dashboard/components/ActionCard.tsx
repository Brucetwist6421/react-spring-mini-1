import { Box, Paper, Typography } from "@mui/material";

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}

export default function ActionCard({ icon, title, desc, color }: ActionCardProps) {
  return (
    /* ✅ 최상위 Grid 제거: 
       부모(MainDashboard)에서 Grid를 잡아주므로, 여기서는 Paper가 최상위여야 
       높이(height: 100%)가 정상적으로 작동합니다.
    */
    <Paper 
      sx={{ 
        p: 2.5, // 패딩을 살짝 늘려 공간감 확보
        borderRadius: "16px", // 랭커 카드와 통일
        border: '1px solid #e2e8f0', 
        boxShadow: 'none',
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        cursor: 'pointer',
        height: '100%', // ✅ 부모 그리드 높이에 맞게 꽉 채움
        width: '100%',
        transition: 'all 0.2s ease-in-out', 
        '&:hover': { 
          backgroundColor: '#f8fafc', 
          borderColor: color, 
          transform: 'translateY(-4px)', // 호버 효과 강화
          boxShadow: `0 10px 15px -5px ${color}20` // 아이콘 색상에 맞춘 그림자
        }
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        backgroundColor: `${color}15`, 
        color: color, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: '12px' // 더 부드러운 디자인
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#1e293b' }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
          {desc}
        </Typography>
      </Box>
    </Paper>
  );
}