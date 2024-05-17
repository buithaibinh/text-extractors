import { fromBuffer } from 'detect-file-type';

export const detectFileTypeByBuffer = (
  data: any
): Promise<{ ext: string; mime: string }> => {
  return new Promise((resolve, reject) => {
    fromBuffer(data, (err: any, result: any) => {
      if (err) {
        reject({
          ext: '',
          mime: 'application/octet-stream',
        });
      } else {
        const mimeResult = result || {
          mime: 'text/html',
          ext: 'html',
        }
        console.log('result', mimeResult);
        resolve(mimeResult);
      }
    });
  });
};

export const replaceBadCharacters = (text: string): string => {
  const replacements = [
    [/[\u201C|\u201D|]|â€œ|â€/g, '"'], // fancy double quotes
    [/[\u2018|\u2019]|â€™|â€˜]/g, "'"], // fancy single quotes/apostrophes
    [/â€¦/g, '…'], // elipses
    [/â€“|â€”/g, '–'], // long hyphen
  ];
  const rLen = replacements.length;

  let repl;
  for (let i = 0; i < rLen; i++) {
    repl = replacements[i];
    text = text.replace(repl[0], repl[1]);
  }

  return text;
};
