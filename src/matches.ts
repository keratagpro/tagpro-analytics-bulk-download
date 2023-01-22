import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

import { TAGPRO_EU_DATA_URL, TAGPRO_EU_SCIENCE_URL } from './constants';
import { Match } from './types';
import { fetchHtml, fetchStream } from './utils/fetch';
import { jsonObjectToJsonlines } from './utils/stream';

export async function getLastMatchId({ url = TAGPRO_EU_SCIENCE_URL } = {}): Promise<number | null> {
	const $ = await fetchHtml(url);

	const lastMatchInput = $('input[name="last"]');

	const value = lastMatchInput.val();

	if (typeof value !== 'string') {
		return null;
	}

	return parseInt(value, 10);
}

export async function createMatchRangeStream(
	fromId: number,
	toId: number,
	{ jsonlines = true, compress = true, url = TAGPRO_EU_DATA_URL } = {}
): Promise<NodeJS.ReadableStream> {
	let stream = await fetchStream(url, {
		bulk: 'matches',
		first: fromId,
		last: toId,
	});

	if (jsonlines) {
		stream = stream.pipe(jsonObjectToJsonlines<Match>('matchId'));
	}

	if (compress) {
		stream = stream.pipe(createGzip());
	}

	return stream;
}

export async function downloadMatchRange(
	fromId: number,
	toId: number,
	filename: string,
	{ jsonlines = true, compress = true } = {}
): Promise<void> {
	const outstream = createWriteStream(filename);

	const stream = await createMatchRangeStream(fromId, toId, { jsonlines, compress });
	stream.pipe(outstream);

	return await finished(outstream);
}
