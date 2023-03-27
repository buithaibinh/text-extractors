
 interface PdfParseOptions {
  max?: number;
  workerSrc?: string;
}


export type ExtractorOptions = {
  // pdf
  pdf?: PdfParseOptions;
};
