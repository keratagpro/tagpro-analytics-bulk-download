import { Readable } from 'node:stream';
import { createGunzip } from 'node:zlib';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { createMapsDownloadStream } from '..';
import { parseJsonlines } from '../utils/stream';

function createFakeReadable(data: any) {
	const readable = new Readable();
	readable.push(data);
	readable.push(null);
	return readable;
}

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

describe('createMapsDownloadStream', () => {
	let mock: MockAdapter;

	beforeAll(() => {
		mock = new MockAdapter(axios);
	});

	afterEach(() => {
		mock.reset();
	});

	beforeEach(() => {
		mock.onGet().reply(200, createFakeReadable(JSON.stringify(testMaps)));
	});

	it('passes params to GET request', async () => {
		await createMapsDownloadStream();

		expect(mock.history.get.length).toBe(1);

		expect(mock.history.get[0].params).toEqual({
			bulk: 'maps',
		});
	});

	it('converts to jsonlines and compresses by default', async () => {
		const stream = await createMapsDownloadStream();

		const results: any[] = [];
		for await (const map of stream.pipe(createGunzip()).pipe(parseJsonlines())) {
			results.push(map);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ mapId: 1, ...testMaps[1] });
		expect(results[1]).toEqual({ mapId: 2, ...testMaps[2] });
	});

	it('can convert to jsonlines without compressing', async () => {
		const stream = await createMapsDownloadStream({ jsonlines: true, compress: false });

		const results: any[] = [];
		for await (const map of stream.pipe(parseJsonlines())) {
			results.push(map);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ mapId: 1, ...testMaps[1] });
		expect(results[1]).toEqual({ mapId: 2, ...testMaps[2] });
	});

	it('can compress without converting to jsonlines', async () => {
		const stream = await createMapsDownloadStream({ jsonlines: false, compress: true });

		const chunks = [];
		for await (const data of stream.pipe(createGunzip())) {
			chunks.push(data);
		}
		const result = Buffer.concat(chunks).toString('utf-8');

		expect(result).toEqual(JSON.stringify(testMaps));
	});

	it('outputs objects when objectMode = true', async () => {
		const stream = await createMapsDownloadStream({ objectMode: true });

		const results: any[] = [];
		for await (const map of stream) {
			results.push(map);
		}

		expect(results).toHaveLength(2);
		expect(results[0]).toEqual({ mapId: 1, ...testMaps[1] });
		expect(results[1]).toEqual({ mapId: 2, ...testMaps[2] });
	});
});
