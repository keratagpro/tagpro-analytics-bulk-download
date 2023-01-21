import createDebug from 'debug';

import { downloadMatchRange, getLastMatchId } from '../lib/index.js';

const debug = createDebug('bulk-download:test');
debug.enabled = true;

const TO_ID = await getLastMatchId();
const FROM_ID = TO_ID - 9;

try {
	await downloadMatchRange(FROM_ID, TO_ID, `matches-${FROM_ID}-${TO_ID}.jsonl.gz`);
} catch (ex) {
	debug('Error downloading matches', ex?.message);
}
