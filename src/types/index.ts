
 interface PdfParseOptions {
  max?: number;
}


export type ExtractorOptions = {
  preserveLineBreaks?: boolean;
  preserveOnlyMultipleLineBreaks?: boolean;

  // pdf
  pdf?: PdfParseOptions;
};
