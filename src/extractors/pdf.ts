import * as pdfjsLib from 'pdfjs-dist';

const extractText = async (
  data: Buffer,
  _mimeType: string,
  options: any = {}
) => {
  const pdfOptions = options.pdf || {
    max: 0,
  };

  // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  pdfjsLib.GlobalWorkerOptions.workerPort = null; // Disable workerPort option

  const loadingTask = pdfjsLib.getDocument(data);

  const pdf = await loadingTask.promise;
  // PDF loaded successfully
  let numPages = pdf.numPages;
  // Call the `getText()` function for each page to extract the text content.
  let text = '';
  const counter = pdfOptions.max > 0 ? pdfOptions.max : numPages;
  for (let i = 1; i <= counter; i++) {
    let page = await pdf.getPage(i);
    let content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join('');
  }

  return text;
};

export default {
  name: 'pdf',
  extract: extractText,
  types: ['application/pdf'],
};
