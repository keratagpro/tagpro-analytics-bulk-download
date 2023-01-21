# @keratagpro/tagpro-analytics-bulk-download

Downloads matches in bulk from [tagpro.eu](https://tagpro.eu/?science). Converts the results to [JSONlines](https://jsonlines.org/) and compresses them with gzip by default.

## Install

```bash
npm install @keratagpro/tagpro-analytics-bulk-download
```

## Usage

### Download maps

```ts
downloadMaps(filename: string): Promise<void>
```

Download all maps as JSON from tagpro.eu.

Example:

```ts
import { downloadMaps } from '@keratagpro/tagpro-analytics-bulk-download';

await downloadMaps('bulkmaps.json');
```

### Download matches

```ts
downloadMatchRange(
	fromId: number, // inclusive
	toId: number, // inclusive
	filename: string,
	{ jsonlines = true, compress = true } = {}
): Promise<void>
```

Downloads a range of matches to a file. Default is to convert to [JSONLines](https://jsonlines.org/) and compress (using gzip).

Example:

```ts
import { downloadMatchRange, getLastMatchId } from '@keratagpro/tagpro-analytics-bulk-download';

// Download latest 10 matches
const lastId = await getLastMatchId();
const firstId = lastId - 9;
const filename = `matches-${firstId}-${lastId}.jsonl.gz`;

try {
	await downloadMatchRange(firstId, lastId, filename);
} catch (ex) {
	console.error('Error downloading matches', ex);
}
```

### Get last match ID

```ts
getLastMatchId(): Promise<number>
```

Returns the latest match ID from tagpro.eu.

Example:

```ts
import { getLastMatchId } from '@keratagpro/tagpro-analytics-bulk-download';

const lastMatchId = await getLastMatchId();
```

### (Advanced usage) Create a NodeJS.WritableStream of matches from tagpro.eu

```ts
createMatchRangeStream(fromId: number, toId: number, { jsonlines = true, compress = true } = {}): Promise<NodeJS.ReadableStream>
```

Returns a NodeJS.ReadableStream with matches from tagpro.eu. By default, the matches are converted to separate JSONlines rows and the stream is compressed with gzip.

### Read JSONlines from a file

```ts
readJsonlines<T = unknown>(filename: string): Promise<T[]>
```

Reads in an uncompressed JSONLines file and returns an array of the parsed JSON objects.

## Note about JSONlines

tagpro.eu exports matches as an object keyed by Match ID-s. The default behavior in this library is to convert the object to separate JSON lines, where each object has an additional `matchId` key.

For example, this JSON export of matches from tagpro.eu:

```json
{"10001":{/../},"10002":{/../}}
```

would be converted to JSONlines like this:

```json
{/../,"matchId": 10001}
{/../,"matchId": 10002}
```
