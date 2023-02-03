import { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { createMapsDownloadStream } from '..';
import { parseJsonlines } from '../utils/stream';

function createReadable(data: any) {
	const readable = new Readable();
	readable.push(data);
	readable.push(null);
	return readable;
}

describe('createMapsStream', () => {
	let mock: MockAdapter;

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	it('passes params to GET request', async () => {
		mock.onGet().reply(200, createReadable('{}'));

		await createMapsDownloadStream();

		expect(mock.history.get.length).toBe(1);

		expect(mock.history.get[0].params).toEqual({
			bulk: 'maps',
		});
	});

	it('adds mapId to object', async () => {
		const testMaps = {
			'1': {
				name: 'map1',
				author: 'author1',
				type: 'ctf',
				marsballs: 0,
				width: 12,
				tiles: 'abcd',
			},
			'2': {
				name: 'map2',
				author: 'author2',
				type: 'nf',
				marsballs: 1,
				width: 22,
				tiles: 'defg',
			},
		};

		mock.onGet().reply(200, createReadable(JSON.stringify(testMaps)));

		const stream = await createMapsDownloadStream();

		const results: any[] = [];
		for await (const map of stream.pipe(createGunzip()).pipe(parseJsonlines())) {
			results.push(map);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ mapId: 1, ...testMaps[1] });
		expect(results[1]).toEqual({ mapId: 2, ...testMaps[2] });
	});
});
