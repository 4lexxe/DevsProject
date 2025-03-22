import PDFDocument from "pdfkit";
import axios from "axios";

export async function createInvoicePDF(
  user: any,
  invoice: any
): Promise<Buffer> {
  const logoUrl = "https://i.ibb.co/dQ09SsH/logoDev2.png";
  const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
  const logoBuffer = Buffer.from(response.data, "binary");

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  let buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {
    let pdfData = Buffer.concat(buffers);
    return pdfData;
  });

  // Agregar contenido al PDF
  // Encabezado
  doc
    .image(logoBuffer, 50, 45, { width: 50 })
    .fontSize(20)
    .text("Factura", 110, 57)
    .moveDown();

  // Información de la empresa
  doc
    .fontSize(10)
    .text("Devs project", 200, 100, { align: "right" })
    .text("Email: devsproject11@gmail.com", 200, 115, { align: "right" })
    .moveDown();

  // Información de la factura
  doc
    .moveDown()
    .fontSize(12)
    .text(`Número de factura: ${invoice.id}`, 50, 160)
    .text(
      `Fecha de emisión: ${new Date(
        invoice.data.date_created
      ).toLocaleDateString()}`,
      50,
      175
    )
    .moveDown();

  // Información del cliente
  doc
    .fontSize(10)
    .text("Nombre del Cliente:", 50, 210)
    .text(user?.name, 150, 210)
    .text("Dirección:", 50, 225)
    .text(user?.address, 150, 225)
    .text("Ciudad y Código Postal:", 50, 240)
    .text(user?.city + ", " + user?.postalCode, 150, 240)
    .text("País:", 50, 255)
    .text(user?.country, 150, 255)
    .moveDown();

  // Detalles del pago
  doc
    .moveDown()
    .fontSize(12)
    .fillColor("black")
    .rect(50, doc.y, 500, 20)
    .fill("#f0f0f0")
    .stroke()
    .fillColor("black")
    .text("Detalles del pago", 55, doc.y + 5, { align: "left" })
    .moveDown();

  doc
    .fontSize(10)
    .text(`Plan: ${invoice.data.reason}`, 50, 300)
    .text(
      `Monto: ${invoice.data.transaction_amount} ${invoice.data.currency_id}`,
      50,
      315
    )
    .text(`ID de pago: ${invoice.data.payment.id}`, 50, 330)
    .text(`Estado del pago: ${invoice.data.payment.status}`, 50, 345)
    .text(`Detalle: ${invoice.data.payment.status_detail}`, 50, 360)
    .text(
      `Fecha de débito: ${new Date(
        invoice.data.debit_date
      ).toLocaleDateString()}`,
      50,
      375
    )
    .text(`Método de pago: ${invoice.data.payment_method_id}`, 50, 390)
    .moveDown();

  // Línea de separación
  doc.moveTo(50, 400).lineTo(550, 400).strokeColor("#d3d3d3").stroke();

  doc
    .fontSize(10)
    .text(
      `Monto Total: ${invoice.data.transaction_amount} ${invoice.data.currency_id}`,
      50,
      420
    )
    .moveDown();

  // Información adicional
  doc
    .moveDown()
    .fontSize(10)
    .text("Gracias por su compra", { align: "center" })
    .moveDown();

  // Línea de separación
  doc.moveTo(50, 450).lineTo(550, 450).strokeColor("#d3d3d3").stroke();

  // Detalles bancarios y de contacto
  doc
    .moveDown()
    .fontSize(10)
    .text("Detalles Bancarios:", 50, 470)
    .text("Nombre del Banco", 50, 485)
    .text("Cuenta Bancaria", 50, 500)
    .text("Datos de Contacto:", 300, 470)
    .text("Correo electrónico", 300, 485)
    .text("Teléfono", 300, 500)
    .moveDown();

  doc.end();
  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
}
