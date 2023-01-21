# @keratagpro/analytics-bulk-download

Downloads matches in bulk from tagpro.eu. Converts the results to jsonlines and compresses them with gzip by default.

## API

### Download maps

```ts
downloadMaps(filename: string): Promise<void>
```

Download maps as JSON from tagpro.eu.

### Get last match ID

```ts
getLastMatchId(): Promise<number>
```

### Download matches

```ts
downloadMatchRangeStream(
	fromId: number,
	toId: number,
	filename: string,
	{ jsonlines = true, compress = true } = {}
): Promise<NodeJS.WritableStream>
```

Downloads a range of matches to a file. Default is to convert to [JSONLines](https://jsonlines.org/) and compress (using gzip).

```ts
requestMatchRangeStream(fromId: number, toId: number): Promise<NodeJS.ReadableStream>
```

Returns a download stream of a range of matches from tagpro.eu.

```ts
readJsonlines<T = any>(filename: string): Promise<T[]>
```

Reads in a JSONLines file and returns an array of the parsed JSON objects.
