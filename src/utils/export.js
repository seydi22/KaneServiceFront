import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { jsPDF } from 'jspdf'
import { autoTable } from 'jspdf-autotable'

// Styles réutilisables pour un rendu professionnel
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1e3a5f' } }
const HEADER_FONT = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
const TITLE_FONT = { bold: true, size: 14 }
const SUBTITLE_FONT = { size: 10, color: { argb: 'FF64748b' } }
const THIN_BORDER = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' }
}

function styleHeaderRow (row) {
  row.height = 22
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = { vertical: 'middle', wrapText: true }
    cell.border = THIN_BORDER
  })
}

function formatPeriod (reportData) {
  const p = reportData.periode
  if (!p) return ''
  if (typeof p === 'string') return p
  if (p.dateDebut && p.dateFin) return `${p.dateDebut} → ${p.dateFin}`
  if (p.mois && p.annee) return `${String(p.mois).padStart(2, '0')}/${p.annee}`
  return ''
}

function downloadExcelBlob (buffer, filename) {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.xlsx`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportToExcel = (data, filename = 'export') => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Données')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

/**
 * Export Excel professionnel avec design moderne (ExcelJS)
 * Feuilles: Résumé (FCFA + Ouguiya), Par agent, Par point de service, Par catégorie, Opérations détail
 */
export const exportReportToExcelMultiSheets = async (reportData, filename = 'rapport') => {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'KANE'
  workbook.created = new Date()

  const periodLabel = formatPeriod(reportData)

  // —— Feuille Résumé ——
  const wsResume = workbook.addWorksheet('Résumé', { views: [{ showGridLines: false }] })
  wsResume.getColumn(1).width = 28
  wsResume.getColumn(2).width = 18
  wsResume.getColumn(3).width = 18
  const titleRow = wsResume.addRow(['RAPPORT D\'OPÉRATIONS'])
  titleRow.font = TITLE_FONT
  titleRow.height = 26
  wsResume.mergeCells('A1:C1')
  if (periodLabel) {
    const subRow = wsResume.addRow([`Période : ${periodLabel}`])
    subRow.font = SUBTITLE_FONT
    subRow.getCell(1).alignment = { horizontal: 'left' }
    wsResume.mergeCells('A2:C2')
  }
  wsResume.addRow([])
  const resumeHeaders = wsResume.addRow(['Indicateur', 'Valeur (F CFA)', 'Valeur (Ouguiya)'])
  styleHeaderRow(resumeHeaders)
  const fmtNum = (n) => (n != null && !Number.isNaN(Number(n)) ? Number(n) : 0)
  const totalOps = fmtNum(reportData.totalOperations)
  const totalFcfa = fmtNum(reportData.montantTotalFcfa)
  const totalOuguiya = fmtNum(reportData.montantTotalOuguiya)

  wsResume.addRow(['Total opérations', totalOps, '']).eachCell((c, colNumber) => {
    c.border = THIN_BORDER
    if (colNumber === 1) c.alignment = { horizontal: 'left' }
  })
  wsResume.addRow(['Montant total FCFA (XOF)', totalFcfa, '']).eachCell((c, colNumber) => {
    c.border = THIN_BORDER
    if (colNumber === 2) {
      c.value = totalFcfa
      c.numFmt = '#,##0 "F CFA"'
    }
    if (colNumber === 1) c.alignment = { horizontal: 'left' }
  })
  wsResume.addRow(['Montant total Ouguiya (MRU)', '', totalOuguiya]).eachCell((c, colNumber) => {
    c.border = THIN_BORDER
    if (colNumber === 3) {
      c.value = totalOuguiya
      c.numFmt = '#,##0 "MRU"'
    }
    if (colNumber === 1) c.alignment = { horizontal: 'left' }
  })

  // —— Feuille Par agent ——
  if (reportData.statsParAgent?.length) {
    const wsAgent = workbook.addWorksheet('Par agent', { views: [{ showGridLines: true }] })
    const colWidths = [22, 14, 12, 16, 16, 20, 20]
    colWidths.forEach((w, i) => { wsAgent.getColumn(i + 1).width = w })
    wsAgent.addRow(['Détail par agent']).font = TITLE_FONT
    if (periodLabel) wsAgent.addRow([`Période : ${periodLabel}`]).font = SUBTITLE_FONT
    wsAgent.addRow([])
    const agentHeader = wsAgent.addRow([
      'Agent', 'Matricule', 'Nb opérations', 'Total FCFA', 'Total Ouguiya', 'Première opération', 'Dernière opération'
    ])
    styleHeaderRow(agentHeader)
    reportData.statsParAgent.forEach((a, idx) => {
      const agentLabel = [a.prenom, a.nom].filter(Boolean).join(' ') || a.matricule || '-'
      const row = wsAgent.addRow([
        agentLabel,
        a.matricule ?? '-',
        a.totalOperations ?? 0,
        a.totalFcfa ?? 0,
        a.totalOuguiya ?? 0,
        a.premierOp ? new Date(a.premierOp).toLocaleString('fr-FR') : '-',
        a.dernierOp ? new Date(a.dernierOp).toLocaleString('fr-FR') : '-'
      ])
      const fill = idx % 2 === 1 ? 'FFF8FAFC' : 'FFFFFFFF'
      row.eachCell((cell, colNumber) => {
        cell.border = THIN_BORDER
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }
        if (colNumber === 4) cell.numFmt = '#,##0 "F CFA"'
        if (colNumber === 5) cell.numFmt = '#,##0 "MRU"'
      })
    })
  }

  // —— Feuille Par point de service ——
  if (reportData.statsParPointService?.length) {
    const wsPs = workbook.addWorksheet('Par point de service', { views: [{ showGridLines: true }] })
    ;[20, 14, 12, 12, 16, 16].forEach((w, i) => { wsPs.getColumn(i + 1).width = w })
    wsPs.addRow(['Détail par point de service']).font = TITLE_FONT
    if (periodLabel) wsPs.addRow([`Période : ${periodLabel}`]).font = SUBTITLE_FONT
    wsPs.addRow([])
    const psHeader = wsPs.addRow(['Point de service', 'Ville', 'Pays', 'Nb opérations', 'Total FCFA', 'Total Ouguiya'])
    styleHeaderRow(psHeader)
    reportData.statsParPointService.forEach((p, idx) => {
      const row = wsPs.addRow([
        p.nom ?? '-',
        p.ville ?? '-',
        p.pays ?? '-',
        p.totalOperations ?? 0,
        p.totalFcfa ?? 0,
        p.totalOuguiya ?? 0
      ])
      const fill = idx % 2 === 1 ? 'FFF8FAFC' : 'FFFFFFFF'
      row.eachCell((cell, colNumber) => {
        cell.border = THIN_BORDER
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }
        if (colNumber === 5) cell.numFmt = '#,##0 "F CFA"'
        if (colNumber === 6) cell.numFmt = '#,##0 "MRU"'
      })
    })
  }

  // —— Feuille Par catégorie ——
  if (reportData.statsParCategorie?.length) {
    const wsCat = workbook.addWorksheet('Par catégorie', { views: [{ showGridLines: true }] })
    ;[32, 14, 16, 16].forEach((w, i) => { wsCat.getColumn(i + 1).width = w })
    wsCat.addRow(['Détail par catégorie']).font = TITLE_FONT
    if (periodLabel) wsCat.addRow([`Période : ${periodLabel}`]).font = SUBTITLE_FONT
    wsCat.addRow([])
    const catHeader = wsCat.addRow(['Catégorie', 'Nb opérations', 'Total FCFA', 'Total Ouguiya'])
    styleHeaderRow(catHeader)
    reportData.statsParCategorie.forEach((c, idx) => {
      const row = wsCat.addRow([c._id ?? '-', c.totalOperations ?? 0, c.totalFcfa ?? 0, c.totalOuguiya ?? 0])
      const fill = idx % 2 === 1 ? 'FFF8FAFC' : 'FFFFFFFF'
      row.eachCell((cell, colNumber) => {
        cell.border = THIN_BORDER
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }
        if (colNumber === 3) cell.numFmt = '#,##0 "F CFA"'
        if (colNumber === 4) cell.numFmt = '#,##0 "MRU"'
      })
    })
  }

  // —— Feuille Opérations (détail) ——
  if (reportData.operations?.length) {
    const wsOp = workbook.addWorksheet('Opérations (détail)', { views: [{ showGridLines: true }] })
    ;[18, 14, 18, 28, 16, 10, 18, 10, 10, 24].forEach((w, i) => { wsOp.getColumn(i + 1).width = w })
    wsOp.addRow(['Liste détaillée des opérations']).font = TITLE_FONT
    if (periodLabel) wsOp.addRow([`Période : ${periodLabel}`]).font = SUBTITLE_FONT
    wsOp.addRow([])
    const opHeader = wsOp.addRow([
      'Date', 'Service', 'Catégorie', 'Montant', 'Agent', 'Matricule', 'Point de service', 'Ville', 'Pays', 'Commentaire'
    ])
    styleHeaderRow(opHeader)
    reportData.operations.forEach((op, idx) => {
      let montantDisplay = 'N/A'
      if (op.montantRecu != null && op.montantEnvoye != null) {
        montantDisplay = `Reçu: ${op.montantRecu} ${op.deviseRecu || 'XOF'} | Envoyé: ${op.montantEnvoye} ${op.deviseEnvoye || 'XOF'}`
      } else if (op.montant != null) {
        montantDisplay = `${op.montant} ${op.devise || 'XOF'}`
      }
      const agentName = op.agent ? [op.agent.prenom, op.agent.nom].filter(Boolean).join(' ') : '-'
      const row = wsOp.addRow([
        op.dateOperation ? new Date(op.dateOperation).toLocaleString('fr-FR') : '-',
        op.service ?? '-',
        op.categorie ?? '-',
        montantDisplay,
        agentName,
        op.agent?.matricule ?? '-',
        op.pointService?.nom ?? '-',
        op.pointService?.ville ?? '-',
        op.pays ?? '-',
        op.commentaire ?? ''
      ])
      const fill = idx % 2 === 1 ? 'FFF8FAFC' : 'FFFFFFFF'
      row.eachCell((cell) => {
        cell.border = THIN_BORDER
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } }
        cell.alignment = { wrapText: true, vertical: 'middle' }
      })
    })
  }

  const buffer = await workbook.xlsx.writeBuffer()
  downloadExcelBlob(buffer, filename)
}

export const exportToPDF = (data, columns, filename = 'export') => {
  const doc = new jsPDF()
  const safeData = Array.isArray(data) ? data : []
  const safeColumns = Array.isArray(columns) ? columns : []
  const headRow = safeColumns.map((col) => col.label || col.key || '')
  const bodyRows = safeData.map((row) =>
    safeColumns.map((col) => {
      const val = row[col.key]
      return val !== undefined && val !== null ? String(val) : ''
    })
  )

  autoTable(doc, {
    head: [headRow],
    body: bodyRows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 10, right: 10 },
  })

  doc.save(`${filename}.pdf`)
}
