import { createReadStream, existsSync } from 'fs';
import { parse as parseJSON } from 'JSONStream';

export function readJsonlines<T = unknown>(filename: string): Promise<T[]> {
	return new Promise((resolve, reject) => {
		if (!existsSync(filename)) {
			reject(`${filename} does not exist.`);
			return;
		}

		const lines: T[] = [];

		const parser = parseJSON();
		parser.on('data', (d: T) => lines.push(d));
		parser.on('end', () => resolve(lines));

		createReadStream(filename).pipe(parser);
	});
}
