import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

import { TAGPRO_EU_DATA_URL } from './constants';
import { Map } from './types';
import { fetchStream } from './utils/fetch';
import { jsonObjectToJsonlines } from './utils/stream';

export async function createMapsStream({
	jsonlines = true,
	compress = true,
	url = TAGPRO_EU_DATA_URL,
} = {}): Promise<NodeJS.ReadableStream> {
	let stream = await fetchStream(url, {
		bulk: 'maps',
	});

	if (jsonlines) {
		stream = stream.pipe(jsonObjectToJsonlines<Map>('mapId'));
	}

	if (compress) {
		stream = stream.pipe(createGzip());
	}

	return stream;
}

export async function downloadMaps(filename: string, { jsonlines = true, compress = true } = {}): Promise<void> {
	const outstream = createWriteStream(filename);

	const stream = await createMapsStream({ jsonlines, compress });
	stream.pipe(outstream);

	return finished(outstream);
}
