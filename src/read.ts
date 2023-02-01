import { createReadStream } from 'node:fs';
import { createGunzip } from 'node:zlib';

import { parseJsonlines } from './utils/stream';

export function createReadStreamFromFile(filename: string): NodeJS.ReadableStream {
	return createReadStream(filename).pipe(createGunzip()).pipe(parseJsonlines());
}
