#!/usr/bin/env node

import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';

import { downloadMaps } from './maps';
import { downloadMatchRange, getLastMatchId } from './matches';

yargs(hideBin(process.argv))
	.scriptName('tpa-download')
	.usage('Usage: $0 <command> [options]')
	.command(
		'maps <file>',
		'Download maps from tagpro.eu',
		(yargs) => {
			return yargs.positional('file', {
				describe: 'Output filename',
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
				.positional('file', {
					describe: 'Output filename',
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
			downloadMatchRange(argv.fromId, argv.toId, String(argv.file), {
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
