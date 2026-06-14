import type { jsPDF } from "jspdf";

export const PDF_FONT_FAMILY = "Roboto";

let regularBase64: string | null = null;
let boldBase64: string | null = null;
let italicBase64: string | null = null;

async function loadFontBase64(path: string): Promise<string> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Не вдалося завантажити шрифт для PDF: ${path}`);
  }
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function ensureFontDataLoaded(): Promise<void> {
  if (regularBase64 && boldBase64 && italicBase64) {
    return;
  }
  [regularBase64, boldBase64, italicBase64] = await Promise.all([
    loadFontBase64("/fonts/Roboto-Regular.ttf"),
    loadFontBase64("/fonts/Roboto-Bold.ttf"),
    loadFontBase64("/fonts/Roboto-Italic.ttf"),
  ]);
}

export async function applyPdfCyrillicFont(doc: jsPDF): Promise<void> {
  await ensureFontDataLoaded();
  doc.addFileToVFS("Roboto-Regular.ttf", regularBase64!);
  doc.addFileToVFS("Roboto-Bold.ttf", boldBase64!);
  doc.addFileToVFS("Roboto-Italic.ttf", italicBase64!);
  doc.addFont("Roboto-Regular.ttf", PDF_FONT_FAMILY, "normal");
  doc.addFont("Roboto-Bold.ttf", PDF_FONT_FAMILY, "bold");
  doc.addFont("Roboto-Italic.ttf", PDF_FONT_FAMILY, "italic");
  doc.setFont(PDF_FONT_FAMILY, "normal");
}
