/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";

// 1. 타입 인터페이스 정의
interface MapDisplayProps {
  regionImg: string;
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
  locations: any[];
  regionMetadata: Record<string, any>;
  selectedMatchKey?: string;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onMarkerClick: (loc: any) => void;
  onDragStart: (x: number, y: number) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: () => void;
}

export default function MapDisplay({
  regionImg, zoom, position, isDragging, locations, regionMetadata,
  selectedMatchKey, onZoomIn, onZoomOut, onReset, onMarkerClick,
  onDragStart, onDragMove, onDragEnd
}: MapDisplayProps) { // 2. 타입 적용
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        bgcolor: "#f8fafc",
        touchAction: "none",
        cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
      onMouseDown={(e) => onDragStart(e.clientX, e.clientY)}
      onMouseMove={(e) => onDragMove(e.clientX, e.clientY)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={onDragEnd}
    >
      {/* 맵 컨트롤 버튼 레이어 */}
      <Stack direction="column" spacing={1} sx={{ position: "absolute", top: 16, right: 16, zIndex: 30 }}>
        <IconButton onClick={onZoomIn} sx={{ bgcolor: "white", boxShadow: 2, '&:hover': { bgcolor: '#f1f5f9' } }}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={onZoomOut} sx={{ bgcolor: "white", boxShadow: 2, '&:hover': { bgcolor: '#f1f5f9' } }}>
          <RemoveIcon />
        </IconButton>
        <IconButton onClick={onReset} sx={{ bgcolor: "white", boxShadow: 2, '&:hover': { bgcolor: '#f1f5f9' } }}>
          <RestartAltIcon />
        </IconButton>
      </Stack>

      {/* 실제 지도 및 마커 레이어 */}
      <Box
        sx={{
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center center"
        }}
      >
        <img 
          src={regionImg} 
          alt="Region Map" 
          style={{ width: "100%", display: "block", pointerEvents: "none" }} 
        />
        
        {locations.map((loc, index) => {
          const pos = regionMetadata[loc.matchKey];
          if (!pos) return null;
          const isSelected = selectedMatchKey === loc.matchKey;
          
          return (
            <Tooltip title={pos.koName} key={`${loc.matchKey}-${index}`} arrow>
              <LocationOnIcon
                onClick={() => onMarkerClick(loc)}
                sx={{
                  position: "absolute",
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  color: isSelected ? "#3b82f6" : "#ef4444",
                  fontSize: isSelected ? `${3.5 / zoom}rem` : `${2.5 / zoom}rem`,
                  transform: "translate(-50%, -100%)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                  cursor: "pointer",
                  zIndex: isSelected ? 10 : 1,
                  transition: "all 0.2s ease",
                  pointerEvents: "auto"
                }}
              />
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}