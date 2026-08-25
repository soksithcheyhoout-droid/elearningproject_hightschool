import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';

/**
 * Generates and downloads a high-definition official MoEYS BacII Examination Paper with full solution key as a PDF file.
 * @param {Object} paper - The exam paper object containing year, subject, stream, exercises, etc.
 * @returns {Promise<boolean>}
 */
export async function downloadBacIIPdf(paper) {
  if (!paper) return false;

  // Create an offscreen DOM container with official Ministry examination paper styling
  const container = document.createElement('div');
  container.id = 'bacii-pdf-render-root';
  container.style.position = 'fixed';
  container.style.top = '-99999px';
  container.style.left = '-99999px';
  container.style.width = '794px'; // Standard A4 width at 96 DPI
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#1e293b';
  container.style.fontFamily = "'Kantumruy Pro', 'Siemreap', sans-serif";
  container.style.padding = '40px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';

  const isSocial = paper.stream === 'social';
  const streamTextKm = isSocial ? 'ថ្នាក់វិទ្យាសាស្ត្រសង្គម' : 'ថ្នាក់វិទ្យាសាស្ត្រពិត';

  container.innerHTML = `
    <div style="border: 2px solid #003366; padding: 24px; border-radius: 12px; background: #ffffff;">
      
      <!-- Official Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #005baa; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="text-align: left; line-height: 1.5;">
          <div style="font-size: 13px; font-weight: bold; color: #003366;">ក្រសួងអប់រំ យុវជន និងកីឡា</div>
          <div style="font-size: 11px; color: #475569;">នាយកដ្ឋានកិច្ចការប្រឡងមធ្យមសិក្សាទុតិយភូមិ</div>
          <div style="font-size: 10px; color: #64748b;">ប្រព័ន្ធបណ្ណសារវិញ្ញាសាជាតិ MoTDAR</div>
        </div>

        <div style="text-align: center; line-height: 1.4;">
          <div style="font-size: 14px; font-weight: bold; color: #003366;">ព្រះរាជាណាចក្រកម្ពុជា</div>
          <div style="font-size: 12px; font-weight: bold; color: #b45309;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
          <div style="font-size: 16px; letter-spacing: 2px; color: #005baa;">❖ ❖ ❖</div>
        </div>
      </div>

      <!-- Exam Title Badge Box -->
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border: 1.5px solid #0284c7; border-radius: 10px; padding: 14px; text-align: center; margin-bottom: 24px;">
        <div style="font-size: 16px; font-weight: 900; color: #003366; margin-bottom: 4px;">
          ${paper.paperTitleKm}
        </div>
        <div style="font-size: 12px; color: #475569; font-weight: 600; margin-bottom: 8px;">
          ${paper.paperTitleEn || ''}
        </div>
        <div style="display: flex; justify-content: center; gap: 16px; font-size: 11px; font-weight: bold; color: #0369a1;">
          <span>📅 សម័យប្រឡង៖ ឆ្នាំ ${paper.year}</span>
          <span>•</span>
          <span>🎓 ផ្នែក៖ ${streamTextKm}</span>
          <span>•</span>
          <span>⏱️ រយៈពេល៖ ${paper.duration}</span>
          <span>•</span>
          <span>🏆 ពិន្ទុពេញ៖ ${paper.totalPoints} ពិន្ទុ</span>
        </div>
      </div>

      <!-- Exercises & Solution Keys List -->
      <div style="display: flex; flex-direction: column; gap: 20px;">
        ${(paper.exercises || []).map((ex, idx) => `
          <div style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; background: #fafafa;">
            
            <div style="font-size: 13px; font-weight: 900; color: #003366; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 10px; display: flex; justify-content: space-between;">
              <span>${ex.titleKm}</span>
            </div>

            <!-- Problem Statement -->
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 12px; font-size: 11.5px; line-height: 1.7; color: #1e293b;">
              <div style="font-weight: bold; color: #b45309; margin-bottom: 4px;">📝 ប្រធានលំហាត់ / សំណួរ៖</div>
              <div style="white-space: pre-line;">${escapeHtml(ex.problemText)}</div>
            </div>

            <!-- Official Solution Key -->
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 12px; font-size: 11.5px; line-height: 1.7; color: #064e3b;">
              <div style="font-weight: bold; color: #15803d; margin-bottom: 4px;">💡 ដំណោះស្រាយផ្លូវការរបស់ក្រសួងអប់រំ៖</div>
              <div style="white-space: pre-line; font-family: monospace, sans-serif; font-size: 11px;">${escapeHtml(ex.solutionText)}</div>
            </div>

          </div>
        `).join('')}
      </div>

      <!-- Document Footer -->
      <div style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed #94a3b8; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: #64748b;">
        <div>ឯកសារផ្លូវការចេញដោយនាយកដ្ឋានប្រឡង MoEYS & MoTDAR</div>
        <div>ទាក់ទងជំនួយបច្ចេកទេស Telegram: @kaixite</div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    // Wait a brief tick for fonts & layouts to settle
    await new Promise(r => setTimeout(r, 120));

    const dataUrl = await toPng(container, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const printWidth = pdfWidth - margin * 2;
    const printHeight = (container.offsetHeight * printWidth) / container.offsetWidth;

    // Handle single or multi-page PDF output
    let heightLeft = printHeight;
    let position = margin;
    let page = 1;

    pdf.addImage(dataUrl, 'PNG', margin, position, printWidth, printHeight);
    heightLeft -= (pdfHeight - margin * 2);

    while (heightLeft > 0) {
      position = margin - (page * (pdfHeight - margin * 2));
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', margin, position, printWidth, printHeight);
      heightLeft -= (pdfHeight - margin * 2);
      page++;
    }

    const cleanSub = (paper.subjectKey || 'exam').toLowerCase();
    const fileName = `BacII_${paper.year}_${cleanSub}_${paper.stream}_Official_MoEYS_Exam_Solution.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('PDF Generation failed, fallback to print view', error);
    // Fallback: Open clean printable window
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.write(`
        <html>
          <head>
            <title>${paper.paperTitleKm}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Kantumruy Pro', sans-serif; padding: 20px; color: #1e293b; }
              @media print { button { display: none; } }
            </style>
          </head>
          <body>
            ${container.innerHTML}
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWin.document.close();
      return true;
    }
    return false;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
