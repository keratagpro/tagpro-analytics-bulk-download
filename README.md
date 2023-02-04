# TagPro Analytics bulk downloader

JS library and CLI tool to download maps and matches in bulk from [tagpro.eu](https://tagpro.eu/?science). Matches are converted to [JSONlines](https://jsonlines.org/) and compressed with gzip by default.

> **Note**
> tagpro.eu exports matches as an object keyed by Match ID-s. The default behavior in this library is to convert the object to separate JSON lines, where each object has an additional `matchId` key.
>
> For example, this JSON export of matches from tagpro.eu:
>
> ```
> {"10001":{/../},"10002":{/../}}
> ```
>
> would be converted to JSONlines like this:
>
> ```
> {/../,"matchId": 10001}
> {/../,"matchId": 10002}
> ```

## Install

```bash
npm install @keratagpro/tagpro-analytics-bulk-downloader
```

## CLI

Use the included `tpa-download` script to download maps & matches from the command line.

### Download all maps

```bash
tpa-download maps [--no-compress] [--no-jsonlines] <filename>
```

Example:

```bash
tpa-download maps bulkmaps.jsonl.gz
```

### Download matches

```bash
tpa-download matches --from-id <fromId> --to-id <toId> [--no-compress] [--no-jsonlines] <filename>
```

Example:

```bash
tpa-download matches --from-id 1000 --to-id 2000 matches-1000-2000.jsonl.gz
```

### Get last match ID

```bash
tpa-download last-match-id
```

## API

### Download maps

```ts
/**
 * Download all maps from tagpro.eu.
 */
downloadMaps(filename: string, { jsonlines = true, compress = true } = {}): Promise<void>
```

Example:

```ts
import { downloadMaps } from '@keratagpro/tagpro-analytics-bulk-downloader';

await downloadMaps('bulkmaps.json');
```

### Download matches

```ts
/**
 * Downloads a range of matches to a file. Default is to convert to [JSONLines](https://jsonlines.org/) and compress (using gzip).
 */
downloadMatchRange(
	fromId: number, // inclusive
	toId: number, // inclusive
	filename: string,
	{ jsonlines = true, compress = true } = {}
): Promise<void>
```

Example:

```ts
import { downloadMatchRange, getLastMatchId } from '@keratagpro/tagpro-analytics-bulk-downloader';

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
/**
 * Returns the latest match ID from tagpro.eu.
 */
getLastMatchId(): Promise<number>
```

Example:

```ts
import { getLastMatchId } from '@keratagpro/tagpro-analytics-bulk-downloader';

const lastMatchId = await getLastMatchId();
```

### Streams API

```ts
/**
 * Returns a NodeJS.ReadableStream with maps from tagpro.eu.
 */
createMapsDownloadStream({ objectMode = false, jsonlines = true, compress = true }): Promise<NodeJS.ReadableStream>
```

```ts
/**
 * Returns a NodeJS.ReadableStream of matches from tagpro.eu.
 */
createMatchRangeDownloadStream(fromId: number, toId: number, { objectMode = false, jsonlines = true, compress = true } = {}): Promise<NodeJS.ReadableStream>
```

```ts
/**
 * Returns a NodeJS.ReadableStream of maps or matches from the given jsonl.gz file.
 */
createReadStreamFromFile(filename: string): NodeJS.ReadableStream
```
