import { PassThrough } from 'node:stream';

export class StreamCombiner extends PassThrough {
	private transformStream?: NodeJS.ReadableStream;

	constructor(public streams: NodeJS.ReadWriteStream[]) {
		super();

		this.on('pipe', (source: NodeJS.ReadableStream) => {
			source.unpipe(this);
			for (const stream of this.streams) {
				source = source.pipe(stream);
			}
			this.transformStream = source;
		});
	}

	pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean | undefined }) {
		return this.transformStream!.pipe(destination, options);
	}
}
