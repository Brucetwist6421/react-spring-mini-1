import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

export interface RowData {
  id: number;
  firstName: string | null;
  lastName: string | null;
  age: number | null;
  gross?: number;
  costs?: number;
  taxRate?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  row: RowData | null;
}

export default function PokemonDetailModal({ open, onClose, row }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        상세조회
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          label="ID"
          value={row?.id ?? ""}
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="First Name"
          value={row?.firstName ?? ""}
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Last Name"
          value={row?.lastName ?? ""}
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Age"
          value={row?.age ?? ""}
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Gross"
          value={row?.gross ?? ""}
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Costs"
          value={row?.costs ?? ""}
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Tax Rate"
          value={
            row?.taxRate != null ? (row.taxRate * 100).toFixed(1) + "%" : ""
          }
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
        <TextField
          label="Profit"
          value={
            row &&
            typeof row.gross === "number" &&
            typeof row.costs === "number"
              ? String(row.gross - row.costs)
              : ""
          }
          fullWidth
          margin="dense"
          slotProps={{ input: { readOnly: true } }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
      </DialogActions>
    </Dialog>
  );
}
