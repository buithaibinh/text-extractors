import { pdf, html, doc, ppt, xls, image } from './extractors';
import { ExtractorOptions } from './types';
import { replaceBadCharacters } from './utils';

const extractors = [pdf, html, doc, ppt, xls, image];

// global, all file type, content cleansing
const cleanseText = (text: string, options: ExtractorOptions): string => {
  text = replaceBadCharacters(text);
  return text;
};

const extract = async (data: Buffer, type: string, opt: any = {}) => {
  const extractor = extractors.find((e) => e.types.includes(type));
  if (extractor) {
    const text = await extractor.extract(data, type, opt);
    return cleanseText(text, opt);
  }
  return '';
};

export default extract;
