import { FromSchema } from 'json-schema-to-ts';
import { createHmac } from 'crypto';

import tokenSchema from '../schemas/token.schema';

type Token = FromSchema<typeof tokenSchema>;

const SECRET =
  '0917b13a9091915d54b6336f45909539cce452b3661b21f386418a257883b30a';

/** Hash-based Message Authentication Code */
function signHMAC(data: unknown): string {
  return createHmac('sha256', SECRET)
    .update(JSON.stringify(data))
    .digest('hex');
}

function getData<Data = Token>(token: string): Data {
  try {
    const [header, payload, verifySignature] = token.split('.');
    const hash = signHMAC(`${header}.${payload}`);

    if (verifySignature !== hash) {
      throw new Error('token not valid');
    }

    return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8'));
  } catch (error) {
    throw new Error('token not valid');
  }
}

function packData<Data = Token>(data: Data): string {
  const header = 'header';
  const payload = Buffer.from(JSON.stringify(data), 'utf-8').toString('base64');
  const hash = signHMAC(`${header}.${payload}`);

  return `${header}.${payload}.${hash}`;
}

export { getData, packData, Token };
