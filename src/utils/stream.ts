import { Transform } from 'node:stream';

import { parse as parseJSON } from 'JSONStream';

export { parse as parseJsonlines } from 'jsonlines';
export { stringify as stringifyJsonlines } from 'jsonlines';

/**
 * Creates a Transform stream that splits a single JSON object into multiple
 * { key, value } objects.
 *
 * For example, this JSON:
 * ```json
 * { "1": { "foo": 10 }, "2": { "bar": 20 } }
 * ```
 *
 * will be split into:
 * ```json
 * { "key": "1", "value": { "foo": 10 } }
 * { "key": "2", "value": { "bar": 20 } }
 * ```
 */
export function splitJsonByKeys() {
	return parseJSON('$*');
}

/**
 * Creates a Transform stream that expects { key, value } objects and transforms
 * them to { ...value, [fieldName]: Number(key) } objects.
 *
 * For example, this JSON:
 * ```json
 * { "key": "1", "value": { "foo": 10 } }
 * ```
 *
 * will be transformed to:
 * ```json
 * { "foo": 10, "someId": 1 }
 * ```
 */
export function injectKeyInsideObject<T>(injectedFieldName: keyof T) {
	return new Transform({
		objectMode: true,
		transform({ key, value }, _encoding, callback) {
			this.push({ ...value, [injectedFieldName]: parseInt(key, 10) });
			callback();
		},
	});
}
