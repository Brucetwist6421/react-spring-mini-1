import { useState, useCallback } from "react";

export const usePokemonLocationMap = () => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 0.5, 1);
    setZoom(newZoom);
    if (newZoom === 1) setPosition({ x: 0, y: 0 });
  };

  const handleReset = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const onDragStart = (x: number, y: number) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: x - position.x, y: y - position.y });
  };

  const onDragMove = (x: number, y: number) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({ x: x - dragStart.x, y: y - dragStart.y });
  };

  const onDragEnd = () => setIsDragging(false);

  return {
    zoom, position, isDragging,
    handleZoomIn, handleZoomOut, handleReset,
    onDragStart, onDragMove, onDragEnd
  };
};