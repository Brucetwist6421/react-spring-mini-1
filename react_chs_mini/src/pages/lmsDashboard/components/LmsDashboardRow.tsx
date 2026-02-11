import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, Collapse, Grid, IconButton, LinearProgress, Paper, TableCell, TableRow, Typography } from "@mui/material";
import { useState } from "react";
import type { LmsDashboardData } from "../types/lmsDashboardType";

const LmsDashboardRow = ({ row }: { row: LmsDashboardData }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="subtitle2" fontWeight="bold">{row.className}</Typography>
          <Typography variant="caption">{row.period}</Typography>
        </TableCell>
        <TableCell align="center">{row.term}기</TableCell>
        {/* 수정 1: active_accounts -> activeAccounts / total_enrolled -> totalEnrolled */}
        <TableCell align="center">{row.activeAccounts} / {row.totalEnrolled}</TableCell>
        <TableCell align="right">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
             <Typography variant="body2" sx={{ mr: 1, minWidth: 35 }}>{row.totalAvgRatio}%</Typography>
             <LinearProgress 
                variant="determinate" 
                value={row.totalAvgRatio} 
                sx={{ flexGrow: 1, height: 10, borderRadius: 5 }} 
                color={row.totalAvgRatio > 70 ? "success" : "warning"}
             />
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">과목별 이행률</Typography>
              {/* 수정 2: Grid container 설정 확인 */}
              <Grid container spacing={2}>
                {row.subjects.map((sub, idx) => (
                  /* 수정 3: MUI v6 기준 - item 속성을 제거하고 사이즈만 명시 */
                  <Grid key={idx} size={{ xs: 12, sm: 4 }}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">{sub.subjectName}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2">{sub.ratio}%</Typography>
                        <Typography variant="body2">{sub.submittedCount}명 완료</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={sub.ratio} sx={{ mt: 1 }} />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default LmsDashboardRow;