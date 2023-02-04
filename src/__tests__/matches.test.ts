import { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { createMatchRangeDownloadStream } from '..';
import { parseJsonlines } from '../utils/stream';

function createFakeReadable(data: any) {
	const readable = new Readable();
	readable.push(data);
	readable.push(null);
	return readable;
}

const testMatches = {
	'1': {
		server: 'server1',
		port: 123,
		official: true,
		group: '',
	},
	'2': {
		server: 'server2',
		port: 234,
		official: true,
		group: '',
	},
};

describe('createMatchRangeStream', () => {
	let mock: MockAdapter;

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	beforeEach(() => {
		mock.onGet().reply(200, createFakeReadable(JSON.stringify(testMatches)));
	});

	it('passes params to GET request', async () => {
		await createMatchRangeDownloadStream(1, 2);

		expect(mock.history.get.length).toBe(1);

		expect(mock.history.get[0].params).toEqual({
			bulk: 'matches',
			first: 1,
			last: 2,
		});
	});

	it('converts to jsonlines and compresses by default', async () => {
		const stream = await createMatchRangeDownloadStream(1, 2);

		const results: any[] = [];
		for await (const match of stream.pipe(createGunzip()).pipe(parseJsonlines())) {
			results.push(match);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ matchId: 1, ...testMatches[1] });
		expect(results[1]).toEqual({ matchId: 2, ...testMatches[2] });
	});

	it('can convert to jsonlines without compressing', async () => {
		const stream = await createMatchRangeDownloadStream(1, 2, { jsonlines: true, compress: false });

		const results: any[] = [];
		for await (const map of stream.pipe(parseJsonlines())) {
			results.push(map);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ matchId: 1, ...testMatches[1] });
		expect(results[1]).toEqual({ matchId: 2, ...testMatches[2] });
	});

	it('can compress without converting to jsonlines', async () => {
		const stream = await createMatchRangeDownloadStream(1, 2, { jsonlines: false, compress: true });

		const chunks = [];
		for await (const data of stream.pipe(createGunzip())) {
			chunks.push(data);
		}
		const result = Buffer.concat(chunks).toString('utf-8');

		expect(result).toEqual(JSON.stringify(testMatches));
	});

	it('outputs objects when objectMode = true', async () => {
		mock.onGet().reply(200, createFakeReadable(JSON.stringify(testMatches)));

		const stream = await createMatchRangeDownloadStream(1, 2, { objectMode: true });

		const results: any[] = [];
		for await (const match of stream) {
			results.push(match);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ matchId: 1, ...testMatches[1] });
		expect(results[1]).toEqual({ matchId: 2, ...testMatches[2] });
	});
});
