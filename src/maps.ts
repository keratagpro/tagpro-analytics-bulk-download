import axios from 'axios';
import { createWriteStream } from 'node:fs';
import { finished } from 'node:stream';
import { promisify } from 'node:util';

const finishedAsync = promisify(finished);

import { TAGPRO_EU_DATA_URL } from './constants.js';

export async function requestMapsStreamAsync(): Promise<NodeJS.ReadStream> {
	const { data } = await axios.get(TAGPRO_EU_DATA_URL, {
		params: {
			bulk: 'maps',
		},
		responseType: 'stream',
	});

	return data;
}

export async function downloadMaps(filename: string): Promise<void> {
	const outstream = createWriteStream(filename);

	(await requestMapsStreamAsync()).pipe(outstream);

	return finishedAsync(outstream);
}
