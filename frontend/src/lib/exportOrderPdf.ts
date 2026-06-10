import type { OrderHistoryItem } from "@/types/auth";

const DISCLAIMER =
  "Увага: монтаж має виконувати сертифікований електрик";

function formatMoney(amount: number, currency: string): string {
  const symbol = currency === "EUR" ? "€" : "$";
  return `${symbol}${amount.toFixed(2)}`;
}

export async function exportOrderToPdf(
  order: OrderHistoryItem,
  customerName: string,
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Експорт PDF доступний лише в браузері.");
  }
  if (order.items.length === 0) {
    throw new Error("У цьому замовленні немає позицій для експорту.");
  }

  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const orderId = order.orderNumber.replace(/^ORD-/, "");

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Електроаксесуари — Замовлення", margin, 16);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Замовлення №${orderId} · ${customerName}`, margin, 26);
  doc.text(
    `Оформлено: ${new Date(order.placedAt).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    32,
  );

  const tableBody = order.items.map((line) => [
    line.name,
    line.sku || (line.productId != null ? `ID ${line.productId}` : "—"),
    String(line.quantity),
    formatMoney(line.unitPrice, order.currency),
    formatMoney(line.lineTotal, order.currency),
  ]);

  autoTable(doc, {
    startY: 44,
    head: [["Назва", "SKU", "К-сть", "Ціна за од.", "Сума"]],
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
    },
    columnStyles: {
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "right", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
    .finalY;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Разом", margin, finalY + 12);
  doc.text(formatMoney(order.total, order.currency), pageWidth - margin, finalY + 12, {
    align: "right",
  });

  const disclaimerY = finalY + 22;
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(margin, disclaimerY, pageWidth - margin * 2, 16, 2, 2, "FD");
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 53, 15);
  doc.text(doc.splitTextToSize(DISCLAIMER, pageWidth - margin * 2 - 8), margin + 4, disclaimerY + 7);

  doc.save(`electrofit-order-${orderId}.pdf`);
}
