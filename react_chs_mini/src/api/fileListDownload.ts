import axios from "axios";

export const fileListDownload = async (vf: { url: string; file?: File }) => {
  try {
    // 1. 전체 파일명 추출 (예: d7c27..._핑가3.gif)
    const fullFileName = vf.file?.name ?? vf.url.split("/").pop()!;

    // 2. UUID 제거 로직 (첫 번째 '_' 이후의 문자열만 가져옴)
    // UUID 형식이 'UUID_파일명.ext'일 때 유효합니다.
    const fileNameWithoutUUID = fullFileName.includes("_")
      ? fullFileName.substring(fullFileName.indexOf("_") + 1)
      : fullFileName;

    // 3. 확장자 분리
    const lastDotIndex = fileNameWithoutUUID.lastIndexOf(".");
    const nameOnly = fileNameWithoutUUID.substring(0, lastDotIndex); // 핑가3
    const extension = fileNameWithoutUUID.substring(lastDotIndex); // .gif

    // 4. 오늘 날짜 및 시간 생성 (YYYYMMDD_HHMMSS)
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "_" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    // 5. 새 파일명 조합 (예: 핑가3_20260128_122103.gif)
    const newFileName = `${decodeURIComponent(nameOnly)}_${timestamp}${extension}`;

    // 6. 다운로드 실행 (서버에는 UUID가 포함된 fullFileName으로 요청)
    const downloadUrl = `http://168.107.51.143:8080/upload/${fullFileName}`;
    const res = await axios.get(downloadUrl, { responseType: "blob" });

    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = newFileName;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("파일 다운로드 실패:", err);
    alert("파일 다운로드 중 오류가 발생했습니다.");
  }
};
