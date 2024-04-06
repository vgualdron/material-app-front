import JsPDF from 'jspdf';
import 'jspdf-autotable';

const getStandardTest = (number) => `Al facturar, por favor citar la liquidación N° ${number}; \
  si tiene alguna duda u objeción, por favor comunicarla antes de emitir la factura. \
  La factura debe ser enviada al correo facturas@flamecolombia.com, este debe contener el \
  xml de validación de la factura electrónica.${'\n'}`;

const printMaterialSettlement = (data) => {
  const stringFullDate = (new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', hour12: false }).format(new Date())).replace(',', '');
  const arrayFullDate = stringFullDate.split(' ');
  let arrayDate = arrayFullDate[0].split('/');
  arrayDate = arrayDate.map((x) => x.padStart(2, '0'));
  const currentDate = `${arrayDate[0]}/${arrayDate[1]}/${arrayDate[2]}`;
  const logo = require('../assets/logo-red-white16mmx18mm.png');
  const doc = new JsPDF('l', 'in', [11, 8.5]);
  const img = new Image();
  img.src = logo;
  doc.addImage(img, 'png', 0.72, 0.60, 1.88976, 0.629921);
  doc.setFontSize(10.40);
  doc.setTextColor(0, 0, 0);
  doc.setFont('Helvetica', 'bold');
  doc.text(2.7, 0.71, 'FLAME COLOMBIA S.A.S');
  doc.setFontSize(6.40);
  doc.text(2.7, 0.86, 'Nit: 901703487-9');
  doc.text(8.65, 1.04, 'Fecha de impresión:');
  doc.text(9.59, 1.04, currentDate);
  doc.text(4.63, 1.29, 'LIQUIDACIÓN DE MATERIAL');
  doc.text(0.7, 1.55, 'TERCERO');
  doc.setFont('Helvetica', 'normal');
  doc.text(1.42, 1.55, data.third.substring(0, 35));
  doc.setFont('Helvetica', 'bold');
  doc.text(4.82, 1.55, 'LIQUIDACION N°');
  doc.setFont('Helvetica', 'normal');
  doc.text(5.81, 1.55, data.consecutive);
  doc.setFont('Helvetica', 'bold');
  doc.text(7.3, 1.55, 'FECHA');
  doc.setFont('Helvetica', 'normal');
  doc.text(7.9, 1.55, data.date);
  doc.setFont('Helvetica', 'bold');
  doc.text(0.7, 1.8, `MATERIALES ENTREGADOS ENTRE EL ${data.startDate} Y ${data.finalDate}`);
  const itemsToTable = data.tickets.map((item) => [item.date, item.referralNumber, item.receiptNumber, item.licensePlate, item.originYard.substring(0, 35), item.destinyYard.substring(0, 35), item.materialName, item.materialWeightSettled, item.unitValue, item.materialSettlementNetValue]);
  itemsToTable.push([{ content: '', colSpan: 10, styles: { cellPadding: 0 } }]);
  itemsToTable.push([
    {
      content: '',
      colSpan: 4,
      styles: {
        cellPadding: 0,
      },
    }, {
      content: 'TOTAL VIAJES',
      colSpan: 1,
      styles: {
        cellPadding: 0.02,
        fontStyle: 'bold',
        halign: 'rigth',
      },
    }, {
      content: data.tickets.length,
      colSpan: 1,
      styles: {
        cellPadding: 0.02,
        halign: 'left',
      },
    }, {
      content: 'SUBTOTAL',
      colSpan: 1,
      styles: {
        cellPadding: 0.02,
        fontStyle: 'bold',
        halign: 'left',
      },
    }, {
      content: data.subtotalAmount,
      styles: {
        cellPadding: 0.02,
        halign: 'right',
      },
    }, {
      content: '',
      styles: {
        cellPadding: 0.02,
        halign: 'left',
      },
    }, {
      content: data.subtotalSettlement,
      styles: {
        cellPadding: 0.02,
        fontStyle: 'bold',
        halign: 'right',
        textColor: [0, 0, 0],
      },
    },
  ]);
  itemsToTable.push([
    {
      content: '',
      colSpan: 6,
      styles: {
        cellPadding: 0,
      },
    }, {
      content: 'RETENCION EN LA FUENTE',
      colSpan: 1,
      styles: {
        cellPadding: 0.02,
        fontStyle: 'bold',
        halign: 'left',
      },
    }, {
      content: data.retentionsPercentage,
      styles: {
        cellPadding: 0.02,
        halign: 'right',
      },
    }, {
      content: '',
      styles: {
        cellPadding: 0.02,
        halign: 'left',
      },
    }, {
      content: data.retentions,
      styles: {
        cellPadding: 0.02,
        halign: 'right',
      },
    },
  ]);
  itemsToTable.push([{ content: '', colSpan: 6, styles: { cellPadding: 0 } }, { content: 'REGALIAS', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'left' } }, { content: data.unitRoyalties, styles: { cellPadding: 0.02, halign: 'right' } }, { content: '', styles: { cellPadding: 0.02, halign: 'left' } }, { content: data.royalties, styles: { cellPadding: 0.02, halign: 'right' } }]);
  itemsToTable.push([{ content: '', colSpan: 6, styles: { cellPadding: 0 } }, { content: 'TOTAL', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'left' } }, { content: '', colSpan: 2, styles: { cellPadding: 0.02, halign: 'left' } }, { content: data.totalSettle, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'right' } }]);
  itemsToTable.push([{ content: '', colSpan: 10, styles: { cellPadding: 0 } }]);
  itemsToTable.push([{ content: 'OBSERVACIONES', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold' } }, { content: (`${getStandardTest(data.consecutive)}\n${data.observation || ''}`), colSpan: 9, styles: { cellPadding: 0.02 } }]);
  doc.autoTable({
    startX: 1.5,
    startY: 2,
    theme: 'striped',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
    },
    bodyStyles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 0.9 },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
    },
    styles: {
      font: 'helvetica',
      fontSize: 6.3,
      cellPadding: 0.02,
      overflow: 'linebreak',
    },
    head: [
      [
        { content: 'Fecha', styles: { halign: 'left', cellPadding: 0.02 } },
        { content: 'N. Remisión', styles: { halign: 'left', cellPadding: 0.02 } },
        { content: 'N. Recibo', styles: { halign: 'left', cellPadding: 0.02 } },
        { content: 'Placa', styles: { halign: 'left' } },
        { content: 'P. Origen / Proveedor', styles: { halign: 'left', cellPadding: 0.02 } },
        { content: 'P. Destino / Cliente', styles: { halign: 'left', cellPadding: 0.02 } },
        { content: 'Material', styles: { halign: 'left', cellPadding: 0.02 } },
        { content: 'Cantidad', styles: { halign: 'right', cellPadding: 0.02 } },
        { content: 'Valor Unitario', styles: { halign: 'right', cellPadding: 0.02 } },
        { content: 'Valor Total', styles: { halign: 'right', cellPadding: 0.02 } },
      ],
    ],
    body: itemsToTable,
  });
  doc.save(`${data.consecutive} - ${data.third.replace('/', '').substring(0, 35)}.pdf`);
};

const printFreightSettlement = (data) => {
  const stringFullDate = (new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short', hour12: false }).format(new Date())).replace(',', '');
  const arrayFullDate = stringFullDate.split(' ');
  let arrayDate = arrayFullDate[0].split('/');
  arrayDate = arrayDate.map((x) => x.padStart(2, '0'));
  const currentDate = `${arrayDate[0]}/${arrayDate[1]}/${arrayDate[2]}`;
  const logo = require('../assets/logo-red-white16mmx18mm.png');
  const doc = new JsPDF('l', 'in', [11, 8.5]);
  const img = new Image();
  img.src = logo;
  doc.addImage(img, 'png', 0.72, 0.60, 1.88976, 0.629921);
  doc.setFontSize(10.40);
  doc.setTextColor(0, 0, 0);
  doc.setFont('Helvetica', 'bold');
  doc.text(2.7, 0.71, 'FLAME COLOMBIA S.A.S');
  doc.setFontSize(6.40);
  doc.text(2.7, 0.86, 'Nit: 901703487-9');
  doc.text(8.65, 1.04, 'Fecha de impresión:');
  doc.text(9.59, 1.04, currentDate);
  doc.text(4.63, 1.29, 'LIQUIDACIÓN DE FLETES');
  doc.text(0.7, 1.55, 'TERCERO');
  doc.setFont('Helvetica', 'normal');
  doc.text(1.42, 1.55, data.third.substring(0, 35));
  doc.setFont('Helvetica', 'bold');
  doc.text(4.82, 1.55, 'LIQUIDACION N°');
  doc.setFont('Helvetica', 'normal');
  doc.text(5.81, 1.55, data.consecutive);
  doc.setFont('Helvetica', 'bold');
  doc.text(7.3, 1.55, 'FECHA');
  doc.setFont('Helvetica', 'normal');
  doc.text(7.9, 1.55, data.date);
  doc.setFont('Helvetica', 'bold');
  doc.text(0.7, 1.8, `SERVICIOS PRESTADOS ENTRE EL ${data.startDate} Y ${data.finalDate}`);
  const itemsToTable = data.tickets.map((item) => [
    item.date,
    item.referralNumber,
    item.receiptNumber,
    item.licensePlate,
    item.originYard.substring(0, 35),
    item.destinyYard.substring(0, 35),
    item.materialName,
    item.freightWeightSettled,
    item.unitValue,
    item.freightSettlementNetValue,
    item.roundTrip && item.roundTrip === 1 ? 'SI' : 'NO',
  ]);
  itemsToTable.push([{ content: '', colSpan: 11, styles: { cellPadding: 0 } }]);
  itemsToTable.push([{ content: '', colSpan: 4, styles: { cellPadding: 0 } }, { content: 'TOTAL VIAJES', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'rigth' } }, { content: data.tickets.length, colSpan: 1, styles: { cellPadding: 0.02, halign: 'left' } }, { content: 'SUBTOTAL', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'left' } }, { content: data.subtotalAmount, styles: { cellPadding: 0.02, halign: 'right' } }, { content: '', styles: { cellPadding: 0.02, halign: 'left' } }, { content: data.subtotalSettlement, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'right' } }]);
  itemsToTable.push([{ content: '', colSpan: 6, styles: { cellPadding: 0 } }, { content: 'RETENCION EN LA FUENTE', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'left' } }, { content: data.retentionsPercentage, styles: { cellPadding: 0.02, halign: 'right' } }, { content: '', styles: { cellPadding: 0.02, halign: 'left' } }, { content: data.retentions, styles: { cellPadding: 0.02, halign: 'right' } }]);
  itemsToTable.push([{ content: '', colSpan: 6, styles: { cellPadding: 0 } }, { content: 'TOTAL', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'left' } }, { content: '', colSpan: 2, styles: { cellPadding: 0.02, halign: 'left' } }, { content: data.totalSettle, styles: { cellPadding: 0.02, fontStyle: 'bold', halign: 'right' } }]);
  itemsToTable.push([{ content: '', colSpan: 11, styles: { cellPadding: 0 } }]);
  itemsToTable.push([{ content: 'OBSERVACIONES', colSpan: 1, styles: { cellPadding: 0.02, fontStyle: 'bold' } }, { content: `${getStandardTest(data.consecutive)}\n${data.observation || ''}`, colSpan: 10, styles: { cellPadding: 0.02 } }]);
  doc.autoTable({
    startX: 1.5,
    startY: 2,
    theme: 'striped',
    head: [[{ content: 'Fecha', styles: { halign: 'left', cellPadding: 0.02 } },
      { content: 'N. Referencia', styles: { halign: 'left', cellPadding: 0.02 } },
      { content: 'N. Recibo', styles: { halign: 'left', cellPadding: 0.02 } },
      { content: 'Placa', styles: { halign: 'left' } },
      { content: 'P. Origen / Proveedor', styles: { halign: 'left', cellPadding: 0.02 } },
      { content: 'P. Destino / Cliente', styles: { halign: 'left', cellPadding: 0.02 } },
      { content: 'Material', styles: { halign: 'left', cellPadding: 0.02 } },
      { content: 'Cantidad', styles: { halign: 'right', cellPadding: 0.02 } },
      { content: 'Valor Unitario', styles: { halign: 'right', cellPadding: 0.02 } },
      { content: 'Valor Total', styles: { halign: 'right', cellPadding: 0.02 } },
      { content: 'Viaje Redondo', styles: { halign: 'left', cellPadding: 0.02 } }]],
    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
    bodyStyles: { halign: 'left', cellPadding: 0.02 },
    columnStyles: {
      0: { cellWidth: 0.9 },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
    },
    styles: {
      font: 'helvetica',
      fontSize: 6.3,
      cellPadding: 0.02,
      overflow: 'linebreak',
    },
    body: itemsToTable,
  });
  doc.save(`${data.consecutive} - ${data.third.replace('/', '').substring(0, 35)}.pdf`);
};

export {
  printMaterialSettlement,
  printFreightSettlement,
};
