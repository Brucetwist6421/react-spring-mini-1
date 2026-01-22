import React from "react";
import axios from "axios";

interface FileItem {
  url: string;
  file?: File;
  id?: number;
}

interface Props {
  file: FileItem;
}

const FileDownloadButton: React.FC<Props> = ({ file }) => {
  const handleDownload = async () => {
    try {
      // URL에서 파일명 추출
      const fileName = file.file?.name ?? file.url.split("/").pop()!;

      // 서버에서 파일 받아오기
      const res = await axios.get<Blob>(file.url, { responseType: "blob" });

      // 브라우저 Blob URL 생성
      const blobUrl = window.URL.createObjectURL(res.data);

      // 다운로드 링크 생성
      const a = document.createElement("a");
      a.href = blobUrl;

      // 한글/공백 파일명 대응
      a.download = decodeURIComponent(fileName);

      // 자동 클릭으로 다운로드 시작
      a.click();

      // 메모리 해제
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("파일 다운로드 실패:", err);
      alert("파일 다운로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <button onClick={handleDownload}>
      다운로드
    </button>
  );
};

export default FileDownloadButton;