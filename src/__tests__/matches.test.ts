import { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { createMatchRangeDownloadStream } from '..';
import { parseJsonlines } from '../utils/stream';

function createReadable(data: any) {
	const readable = new Readable();
	readable.push(data);
	readable.push(null);
	return readable;
}

describe('createMatchRangeStream', () => {
	let mock: MockAdapter;

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	it('passes params to GET request', async () => {
		mock.onGet().reply(200, createReadable('{}'));

		await createMatchRangeDownloadStream(1, 2);

		expect(mock.history.get.length).toBe(1);

		expect(mock.history.get[0].params).toEqual({
			bulk: 'matches',
			first: 1,
			last: 2,
		});
	});

	it('adds matchId to object', async () => {
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

		mock.onGet().reply(200, createReadable(JSON.stringify(testMatches)));

		const stream = await createMatchRangeDownloadStream(1, 2);

		const results: any[] = [];
		for await (const match of stream.pipe(createGunzip()).pipe(parseJsonlines())) {
			results.push(match);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ matchId: 1, ...testMatches[1] });
		expect(results[1]).toEqual({ matchId: 2, ...testMatches[2] });
	});
});
