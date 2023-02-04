import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

import { TAGPRO_EU_DATA_URL } from './constants';
import { Map } from './types';
import { fetchStream } from './utils/fetch';
import { injectKeyInsideObject, splitJsonByKeys, stringifyJsonlines } from './utils/stream';

export async function createMapsDownloadStream({
	objectMode = false,
	jsonlines = true,
	compress = true,
	url = TAGPRO_EU_DATA_URL,
} = {}): Promise<NodeJS.ReadableStream> {
	let stream = await fetchStream(url, {
		bulk: 'maps',
	});

	if (objectMode) {
		return stream.pipe(splitJsonByKeys()).pipe(injectKeyInsideObject<Map>('mapId'));
	}

	if (jsonlines) {
		stream = stream.pipe(splitJsonByKeys()).pipe(injectKeyInsideObject<Map>('mapId')).pipe(stringifyJsonlines());
	}

	if (compress) {
		stream = stream.pipe(createGzip());
	}

	return stream;
}

export async function downloadMaps(filename: string, { jsonlines = true, compress = true } = {}): Promise<void> {
	const outstream = createWriteStream(filename);

	const stream = await createMapsDownloadStream({ jsonlines, compress });
	stream.pipe(outstream);

	return finished(outstream);
}
