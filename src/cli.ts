#!/usr/bin/env node

import { terminalWidth } from 'yargs';
import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { downloadMaps } from './maps';
import { downloadMatchRange, getLastMatchId } from './matches';

yargs(hideBin(process.argv))
	.scriptName('tpa-download')
	.wrap(Math.min(150, terminalWidth()))
	.usage('Usage: $0 <command> [options]')
	.command(
		'maps <file>',
		'Download maps from tagpro.eu',
		(yargs) => {
			return yargs
				.example('$0 maps bulkmaps.jsonl.gz', 'Download maps as JSONLines and compress with Gzip')
				.example('$0 maps --no-compress bulkmaps.jsonl', 'Download maps as JSONLines')
				.example('$0 maps --no-compress --no-jsonlines bulkmaps.json', 'Download maps as JSON')
				.positional('file', {
					type: 'string',
					describe: 'Output filename',
					demandOption: true,
				})
				.options({
					compress: {
						describe: 'Compress output with Gzip',
						type: 'boolean',
						default: true,
					},
					jsonlines: {
						describe: 'Convert output to JSONlines',
						type: 'boolean',
						default: true,
					},
				});
		},
		(argv) => {
			downloadMaps(String(argv.file));
		}
	)
	.command(
		'matches <file>',
		'Download matches from tagpro.eu',
		(yargs) => {
			return yargs
				.example(
					'$0 matches --from-id 12000 --to-id 13000 matches1.jsonl.gz',
					'Download range of matches as JSONLines and compress with Gzip'
				)
				.example(
					'$0 matches --from-id 12000 --to-id 13000 --no-compress matches1.jsonl',
					'Download range of matches as JSONLines'
				)
				.example(
					'$0 matches --from-id 12000 --to-id --no-compress --no-jsonlines 13000 matches1.json',
					'Download range of matches as JSON'
				)
				.positional('file', {
					type: 'string',
					describe: 'Output filename',
					demandOption: true,
				})
				.options({
					'from-id': {
						describe: 'First match ID (inclusive)',
						type: 'number',
						demandOption: true,
					},
					'to-id': {
						describe: 'Last match ID (inclusive)',
						type: 'number',
						demandOption: true,
					},
					'compress': {
						describe: 'Compress output with Gzip',
						type: 'boolean',
						default: true,
					},
					'jsonlines': {
						describe: 'Convert output to JSONlines',
						type: 'boolean',
						default: true,
					},
				});
		},
		(argv) => {
			downloadMatchRange(argv.fromId, argv.toId, argv.file, {
				compress: argv.compress,
				jsonlines: argv.jsonlines,
			});
		}
	)
	.command(
		'last-match-id',
		'Get last match ID from tagpro.eu',
		(yargs) => yargs,
		async () => {
			console.log(await getLastMatchId());
		}
	)
	.alias('h', 'help')
	.alias('v', 'version')
	.demandCommand(1, '')
	.parse();
