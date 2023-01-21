import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream/promises';
import { createGzip } from 'node:zlib';

import axios from 'axios';
import { load } from 'cheerio';
import * as es from 'event-stream';
import { stringify as stringifyJsonlines } from 'jsonlines';
import { parse as parseJSON } from 'JSONStream';

import { TAGPRO_EU_DATA_URL, TAGPRO_EU_SCIENCE_URL } from './constants.js';

export async function getLastMatchId(): Promise<number | null> {
	const { data } = await axios.get(TAGPRO_EU_SCIENCE_URL);
	const $ = load(data);

	const lastMatchInput = $('input[name="last"]');

	const value = lastMatchInput.val();

	if (typeof value !== 'string') {
		return null;
	}

	return parseInt(value, 10);
}

export interface Match {
	matchId: number;
}

function transformToJsonlines(stream: NodeJS.ReadableStream): NodeJS.ReadableStream {
	return stream
		.pipe(parseJSON('$*'))
		.pipe(
			es.mapSync(({ key, value }: { key: string; value: Match }) => ({
				...value,
				matchId: parseInt(key, 10),
			}))
		)
		.pipe(stringifyJsonlines());
}

export async function createMatchRangeStream(
	fromId: number,
	toId: number,
	{ jsonlines = true, compress = true } = {}
): Promise<NodeJS.ReadableStream> {
	let stream = await axios
		.get<NodeJS.ReadableStream>(TAGPRO_EU_DATA_URL, {
			params: {
				bulk: 'matches',
				first: fromId,
				last: toId,
			},
			responseType: 'stream',
		})
		.then((res) => res.data);

	if (jsonlines) {
		stream = transformToJsonlines(stream);
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
