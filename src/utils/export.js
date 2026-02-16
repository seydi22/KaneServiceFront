import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const exportToExcel = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Données')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export const exportToPDF = (data, columns, filename = 'export') => {
  const doc = new jsPDF()
  
  doc.autoTable({
    head: [columns.map(col => col.label)],
    body: data.map(row => columns.map(col => row[col.key] || '')),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] }
  })
  
  doc.save(`${filename}.pdf`)
}
