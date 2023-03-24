// import * as pdf from 'pdf-parse';
const pdfParser = require('pdf-parse');

const DEFAULT_OPTIONS = {
  // https://mozilla.github.io/pdf.js/api/
  pagerender: {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: false,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  },

  //max number of pages to parse
  max: 0,
  //check https://mozilla.github.io/pdf.js/getting_started/
  version: 'v1.10.100',
};

const extractText = async (
  data: Buffer,
  _mimeType: string,
  options: any = {}
) => {
  const opt = {
    ...DEFAULT_OPTIONS,
    ...options.pdf,
  };
  const res = await pdfParser(data, opt);
  if (res) {
    return res.text;
  }
  return '';
};

export default {
  name: 'pdf',
  extract: extractText,
  types: ['application/pdf'],
};
