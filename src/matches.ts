import axios from 'axios';
import { load } from 'cheerio';
import * as es from 'event-stream';
import { createWriteStream } from 'fs';
import { stringify as stringifyJsonlines } from 'jsonlines';
import { parse as parseJSON } from 'JSONStream';
import { finished } from 'node:stream';
import { promisify } from 'node:util';
import { createGzip } from 'zlib';

import { TAGPRO_EU_DATA_URL, TAGPRO_EU_SCIENCE_URL } from './constants.js';

const finishedAsync = promisify(finished);

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

export async function requestMatchRangeStreamAsync(fromId: number, toId: number): Promise<NodeJS.ReadableStream> {
	const res = await axios.get<NodeJS.ReadableStream>(TAGPRO_EU_DATA_URL, {
		params: {
			bulk: 'matches',
			first: fromId,
			last: toId,
		},
		responseType: 'stream',
	});

	return res.data;
}

export async function createMatchRangeStream(
	fromId: number,
	toId: number,
	filename: string,
	{ jsonlines = true, compress = true } = {}
): Promise<NodeJS.WritableStream> {
	let stream = await requestMatchRangeStreamAsync(fromId, toId);

	if (jsonlines) {
		stream = stream
			.pipe(parseJSON('$*'))
			.pipe(
				es.mapSync(({ key, value }: { key: string; value: Match }) => ({
					...value,
					matchId: parseInt(key, 10),
				}))
			)
			.pipe(stringifyJsonlines());
	}

	if (compress) {
		stream = stream.pipe(createGzip());
	}

	return stream.pipe(createWriteStream(filename));
}

export async function downloadMatchRange(
	fromId: number,
	toId: number,
	filename: string,
	{ jsonlines = true, compress = true } = {}
): Promise<void> {
	const stream = await createMatchRangeStream(fromId, toId, filename, { jsonlines, compress });
	return await finishedAsync(stream);
}
