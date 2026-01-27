import type { FormState, PokemonData } from "../types/detailTypes";

export const boolToNum = (v: boolean) => (v ? "1" : "0");

export const validate = (form: FormState) => {
  if (!form.name.trim()) {
    alert("이름을 입력하세요.");
    return false;
  }
  return true;
};

export const isImageFile = (fileName: string): boolean => {
  return /\.(jpe?g|png|gif|webp)$/i.test(fileName);
};

export const isVideoFile = (fileName: string): boolean => {
  return /\.(mp4|webm|ogg|mov|avi)$/i.test(fileName);
};

export const buildUpdateFormData = (
  form: FormState,
  file: File | null,
  variantFiles: Array<{ file?: File; url: string; id?: number }>,
  pokemonData: PokemonData
): FormData => {
  const fd = new FormData();
  
  fd.append("name", form.name);
  fd.append("description", form.description);
  fd.append("type", form.type);
  fd.append("height", String(form.height));
  fd.append("weight", String(form.weight));
  fd.append("isFavorite", boolToNum(form.isFavorite));
  fd.append("isPublic", boolToNum(form.isPublic));
  fd.append("isNotify", boolToNum(form.isNotify));
  fd.append("variant", form.variant);
  fd.append("id", Number(pokemonData.id).toString());

  // 메인 이미지 처리
  if (file) {
    fd.append("mainImage", file);
  } else if (pokemonData?.mainImagePath) {
    fd.append("mainImagePath", pokemonData.mainImagePath);
  }

  // 첨부파일들
  const existingIds: number[] = [];
  variantFiles.forEach((vf) => {
    if (vf.file) {
      fd.append("attachmentFiles", vf.file);
    } else if (vf.id) {
      existingIds.push(vf.id);
    }
  });

  existingIds.forEach((id) => fd.append("existingAttachmentIdList", String(id)));

  return fd;
};

export const getImageSrc = (
  preview: string | null,
  mainImagePath: string | null | undefined,
  spritesFrontDefault: string | null | undefined
): string | null => {
  return preview ?? (mainImagePath ? `http://168.107.51.143:8080/upload/${mainImagePath}` : spritesFrontDefault ?? null);
};
