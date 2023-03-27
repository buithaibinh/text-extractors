import * as pdfjsLib from 'pdfjs-dist';

const extractText = async (
  data: Buffer,
  _mimeType: string,
  options: any = {}
) => {
  const pdfOptions = options.pdf || {
    max: 0,
    standardFontDataUrl: null,
  };

  const loadingTask = pdfjsLib.getDocument({
    data: data,
    standardFontDataUrl: pdfOptions.standardFontDataUrl,
  });

  const pdf = await loadingTask.promise;
  // PDF loaded successfully
  let numPages = pdf.numPages;
  // Call the `getText()` function for each page to extract the text content.
  let text = '';
  const counter = pdfOptions.max > 0 ? pdfOptions.max : numPages;
  for (let i = 1; i <= counter; i++) {
    let page = await pdf.getPage(i);
    let content = await page.getTextContent();

    const items = content.items;
    let prevY = null;
    for (let j = 0; j < items.length; j++) {
      const item: any = items[j];
      // add a line break after each text item if the next item has a lower y coordinate value than the current item.
      if (prevY !== null && item.transform[5] < prevY) {
        text += '\n';
      }
      text += item.str;
      prevY = item.transform[5];
    }
  }

  console.log('pdf text', text);
  return text;
};

export default {
  name: 'pdf',
  extract: extractText,
  types: ['application/pdf'],
};
