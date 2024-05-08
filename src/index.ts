import axios, { AxiosRequestConfig } from 'axios';
import extract from './extract';
import { ExtractorOptions } from './types';

import { detectFileTypeByBuffer } from './utils';

const fromBufferWithMimeType = async (
  data: Buffer,
  mimeType: string,
  opt: ExtractorOptions = {}
): Promise<string> => {
  let text = await extract(data, mimeType, opt);
  return text;
};

const fromBuffer = async (
  data: Buffer,
  opt: ExtractorOptions = {}
): Promise<string> => {
  const mimeType = await detectFileTypeByBuffer(data);
  const text = await fromBufferWithMimeType(data, mimeType.mime, opt);
  return text;
};

const fromUrl = async ({
  url,
  option = {}, // text extraction option.
  axiosConfig = {}, // axios config
}: {
  url: string;
  option?: ExtractorOptions;
  axiosConfig?: AxiosRequestConfig;
}): Promise<string> => {
  const instance = axios.create();
  console.log('axiosConfig', axiosConfig);
  let requestConfig: AxiosRequestConfig = {
    url: url,
    method: axiosConfig.method || 'get',
    baseURL: '',
    transformResponse: [
      async (data: any, headers: any) => {
        const text = await fromBuffer(data, option);
        return text;
      },
    ],

    // fake user agent, to avoid 403
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36',
      ...axiosConfig.headers,
    },
    timeout: 40000,
    withCredentials: false,
    validateStatus: (status: number) => {
      return status >= 200 && status < 300;
    },
    maxRedirects: 5,
    ...axiosConfig,
    responseType: 'arraybuffer', //'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    maxContentLength: 20000000,
  };

  return instance.request(requestConfig).then((res) => {
    return res.data;
  });
};

export { fromUrl, fromBuffer, fromBufferWithMimeType };
