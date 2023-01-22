import es from 'event-stream';
import { stringify as stringifyJsonlines } from 'jsonlines';
import { parse as parseJSON } from 'JSONStream';

import { StreamCombiner } from './StreamCombiner';

export function injectKeyInsideObject<T>(fieldName: keyof T) {
	return es.mapSync(({ key, value }: { key: string; value: T }) => ({
		...value,
		[fieldName]: parseInt(key, 10),
	}));
}

export function jsonObjectToJsonlines<T>(injectedKeyName: keyof T) {
	return new StreamCombiner([parseJSON('$*'), injectKeyInsideObject(injectedKeyName), stringifyJsonlines()]);
}
