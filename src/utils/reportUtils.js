// Función para exportar a CSV
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  try {
    const headers = ['ID', 'Placa', 'Marca', 'Fecha Entrada', 'Hora Entrada', 'Hora Salida', 'Duración', 'Monto (Q)'];
    
    // Función para escapar valores CSV
    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = [
      headers.join(','),
      ...data.map(record => [
        escapeCSVValue(record.id || ''),
        escapeCSVValue(record.plate || record.placa || ''),
        escapeCSVValue(record.brand || record.marca || ''),
        escapeCSVValue(record.entryDate || record.fechaEntrada || ''),
        escapeCSVValue(record.entryTime || record.horaEntrada || ''),
        escapeCSVValue(record.exitTime || record.horaSalida || ''),
        escapeCSVValue(record.duration || record.duracion || ''),
        escapeCSVValue((Number(record.amount || record.monto) || 0).toFixed(2))
      ].join(','))
    ].join('\n');

    // Agregar BOM para caracteres especiales
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL
    setTimeout(() => URL.revokeObjectURL(url), 100);
    
    alert(`Archivo CSV exportado exitosamente: ${filename}.csv`);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    alert('Error al exportar el archivo CSV');
  }
};

// Función para exportar a PDF (simplificada)
export const exportToPDF = (data, filename, date) => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  try {
    const totalAmount = data.reduce((sum, record) => sum + (Number(record.amount || record.monto) || 0), 0);
    const currentDate = new Date().toLocaleDateString('es-GT');
    const currentTime = new Date().toLocaleTimeString('es-GT');

    // Crear contenido HTML para el PDF
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reporte de Estacionamiento</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #0b79d0;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            h1 { 
              color: #0b79d0; 
              margin: 0;
              font-size: 24px;
            }
            .subtitle {
              color: #666;
              font-size: 14px;
              margin-top: 5px;
            }
            .summary { 
              margin-bottom: 20px; 
              padding: 15px; 
              background-color: #f8f9fa;
              border-radius: 5px;
              border-left: 4px solid #0b79d0;
            }
            .summary h3 {
              margin-top: 0;
              color: #0b79d0;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin-top: 10px;
            }
            .summary-item {
              text-align: center;
              padding: 10px;
              background: white;
              border-radius: 5px;
              border: 1px solid #dee2e6;
            }
            .summary-value {
              font-size: 18px;
              font-weight: bold;
              color: #0b79d0;
            }
            .summary-label {
              font-size: 12px;
              color: #666;
              margin-top: 5px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 12px;
            }
            th, td { 
              border: 1px solid #dee2e6; 
              padding: 8px; 
              text-align: left; 
            }
            th { 
              background-color: #0b79d0; 
              color: white;
              font-weight: bold;
              text-align: center;
            }
            tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #dee2e6;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reporte de Estacionamiento</h1>
            <div class="subtitle">Sistema de Gestión de Estacionamiento</div>
          </div>
          
          <div class="summary">
            <h3>Resumen del Reporte</h3>
            <p><strong>Período:</strong> ${date}</p>
            <p><strong>Generado el:</strong> ${currentDate} a las ${currentTime}</p>
            
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">${data.length}</div>
                <div class="summary-label">Total Vehículos</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">Q${totalAmount.toFixed(2)}</div>
                <div class="summary-label">Ingresos Totales</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">Q${data.length > 0 ? (totalAmount / data.length).toFixed(2) : '0.00'}</div>
                <div class="summary-label">Promedio por Vehículo</div>
              </div>
            </div>
          </div>

          <h3>Detalle de Transacciones</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Marca</th>
                <th>Fecha</th>
                <th>Hora Entrada</th>
                <th>Hora Salida</th>
                <th>Duración</th>
                <th>Monto (Q)</th>
              </tr>
            </thead>
            <tbody>
    `;

    data.forEach(record => {
      htmlContent += `
        <tr>
          <td style="text-align: center;">${record.id || ''}</td>
          <td style="text-align: center; font-weight: bold;">${record.plate || record.placa || ''}</td>
          <td>${record.brand || record.marca || ''}</td>
          <td style="text-align: center;">${record.entryDate || record.fechaEntrada || ''}</td>
          <td style="text-align: center;">${record.entryTime || record.horaEntrada || ''}</td>
          <td style="text-align: center;">${record.exitTime || record.horaSalida || '-'}</td>
          <td style="text-align: center;">${record.duration || record.duracion || '-'}</td>
          <td style="text-align: right; font-weight: bold;">Q${(Number(record.amount || record.monto) || 0).toFixed(2)}</td>
        </tr>
      `;
    });

    htmlContent += `
            </tbody>
          </table>
          
          <div class="footer">
            <p>Reporte generado automáticamente por el Sistema de Gestión de Estacionamiento</p>
            <p>Total de registros: ${data.length} | Ingresos totales: Q${totalAmount.toFixed(2)}</p>
          </div>
        </body>
      </html>
    `;

    // Abrir ventana nueva para imprimir
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Esperar a que cargue y luego mostrar el diálogo de impresión
    printWindow.onload = function() {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
    
    alert(`Reporte PDF preparado para ${data.length} registros`);
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    alert('Error al generar el archivo PDF');
  }
};