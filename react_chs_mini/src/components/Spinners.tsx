import { useMemo } from "react";
import {
  Blocks,
  ColorRing,
  DNA,
  FidgetSpinner,
  MagnifyingGlass,
  ProgressBar,
  Vortex,
} from "react-loader-spinner";

const Spinners = [
  <DNA visible={true} height={80} width={80} ariaLabel="loading" />,
  <MagnifyingGlass visible={true} height={80} width={80} ariaLabel="loading" />,
  <Blocks visible={true} height={80} width={80} ariaLabel="loading" />,
  <ColorRing visible={true} height={80} width={80} ariaLabel="loading" />,
  <FidgetSpinner visible={true} height={80} width={80} ariaLabel="loading" />,
  <ProgressBar visible={true} height={80} width={80} ariaLabel="loading" />,
  <Vortex visible={true} height={80} width={80} ariaLabel="loading" />,
];

export default function RandomSpinner() {
  // useMemo: 렌더링 시마다 스피너가 바뀌지 않게 고정
  const randomSpinner = useMemo(() => {
    return Spinners[Math.floor(Math.random() * Spinners.length)];
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {randomSpinner}
    </div>
  );
}
