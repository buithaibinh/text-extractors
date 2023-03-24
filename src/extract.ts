import { pdf, html, doc, ppt, xls, image } from './extractors';
import { ExtractorOptions } from './types';
import { replaceBadCharacters } from './utils';

const extractors = [pdf, html, doc, ppt, xls, image];

const STRIP_ONLY_SINGLE_LINEBREAKS = /(^|[^\n])\n(?!\n)/g; // remove single linebreaks
const WHITELIST_PRESERVE_LINEBREAKS =
  /[^A-Za-z\x80-\xFF\x24\u20AC\xA3\xA5 0-9 \u2015\u2116\u2018\u2019\u201C|\u201D\u2026 \uFF0C \u2013 \u2014 \u00C0-\u1FFF \u2C00-\uD7FF \uFB50–\uFDFF \uFE70–\uFEFF \uFF01-\uFFE6 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'-\w\n\r]*/g; // remove all except linebreaks
const WHITELIST_STRIP_LINEBREAKS =
  /[^A-Za-z\x80-\xFF\x24\u20AC\xA3\xA5 0-9 \u2015\u2116\u2018\u2019\u201C|\u201D\u2026 \uFF0C \u2013 \u2014 \u00C0-\u1FFF \u2C00-\uD7FF \uFB50–\uFDFF \uFE70–\uFEFF \uFF01-\uFFE6 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~'-\w]*/g; //  remove all

// global, all file type, content cleansing
const cleanseText = (text: string, options: ExtractorOptions): string => {
  text = replaceBadCharacters(text);
  if (options.preserveLineBreaks || options.preserveOnlyMultipleLineBreaks) {
    if (options.preserveOnlyMultipleLineBreaks) {
      text = text.replace(STRIP_ONLY_SINGLE_LINEBREAKS, '$1 ').trim();
    }
    text = text.replace(WHITELIST_PRESERVE_LINEBREAKS, ' ');
  } else {
    text = text.replace(WHITELIST_STRIP_LINEBREAKS, ' ');
  }
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
