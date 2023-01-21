const debug = require('debug')('bulk-downloader:test');

const { downloadMatchRange, getLastMatchId } = require('../dist');

debug.enabled = true;

async function downloadLatest(count) {
	const TO_ID = await getLastMatchId();
	const FROM_ID = TO_ID - (count - 1);

	try {
		await downloadMatchRange(FROM_ID, TO_ID, `matches-${FROM_ID}-${TO_ID}.jsonl.gz`);
	} catch (ex) {
		debug('Error downloading matches', ex?.message);
	}
}

downloadLatest(10);
