import axios from "axios";

export const fileListDownload = async (vf: { url: string; file?: File }) => {
  try {
    const fileName = vf.file?.name ?? vf.url.split("/").pop()!;
    // const downloadUrl = `/download/${encodeURIComponent(fileName)}`;
    // 서버 포트 5174로 요청
    const downloadUrl = `http://localhost:5174/pokemon/download/${encodeURIComponent(fileName)}`;

    const res = await axios.get<Blob>(downloadUrl, { responseType: "blob" });
    const blobUrl = window.URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = decodeURIComponent(fileName);
    a.click();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("파일 다운로드 실패:", err);
    alert("파일 다운로드 중 오류가 발생했습니다.");
  }
};