import { cartSubtotal, lineSubtotal } from "@/lib/cartUtils";
import type { CartLine } from "@/types/cart";

const TITLE = "Кошторис електроаксесуарів";
const DISCLAIMER =
  "Увага: монтаж має виконувати сертифікований електрик";

function formatMoney(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

function brandLabel(line: CartLine): string {
  const { brandName, seriesName } = line.product;
  if (brandName && seriesName) {
    return `${brandName} (${seriesName})`;
  }
  return brandName ?? seriesName ?? "—";
}

export async function exportEstimateToPdf(items: CartLine[]): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Експорт PDF доступний лише в браузері.");
  }
  if (items.length === 0) {
    throw new Error("Додайте товари до кошика перед експортом.");
  }

  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const subtotal = cartSubtotal(items);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 32, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(TITLE, margin, 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const dateLabel = new Date().toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Створено: ${dateLabel}`, margin, 26);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  const lineItemLabel =
    items.length === 1 ? "1 позиція" : `${items.length} позицій`;
  doc.text(lineItemLabel, margin, 42);

  const tableBody = items.map((line) => [
    line.product.name,
    brandLabel(line),
    line.product.sku,
    String(line.quantity),
    formatMoney(lineSubtotal(line)),
  ]);

  autoTable(doc, {
    startY: 48,
    head: [["Назва", "Бренд", "SKU", "Кількість", "Ціна"]],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      3: { halign: "center" },
      4: { halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, finalY + 6, pageWidth - margin, finalY + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Разом", margin, finalY + 14);
  doc.text(formatMoney(subtotal), pageWidth - margin, finalY + 14, { align: "right" });

  const disclaimerY = finalY + 28;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, disclaimerY, pageWidth - margin * 2, 18, 2, 2, "FD");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(120, 53, 15);
  const disclaimerLines = doc.splitTextToSize(DISCLAIMER, pageWidth - margin * 2 - 8);
  doc.text(disclaimerLines, margin + 4, disclaimerY + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("ElectroFit — кошторис лише для планування.", margin, disclaimerY + 24);

  doc.save(`electrofit-estimate-${new Date().toISOString().slice(0, 10)}.pdf`);
}
