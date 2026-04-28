// scripts/fetch.js
//
// Fetch authoritative government / regulator HTML for every record in the URL
// list and cache it on disk. Subsequent pipeline stages (extract.js) read the
// cache; fetch.js itself does no parsing.
//
// Input:  data/sources.json
//         Shape: [{ "id": "epr_de_packaging", "url": "https://...", "source_language": "de" }, ...]
//
// Output: cache/html/{id}_{YYYY-MM-DD}.html
//         Plus cache/html/_fetch_log_{YYYY-MM-DD}.json with per-URL status.
//
// Usage:  node scripts/fetch.js
//
// SKELETON ONLY. Each function below is a signature + TODO; real
// implementations land in a follow-up before the first weekly run.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCES_FILE = resolve(ROOT, 'data/sources.json');
const CACHE_DIR = resolve(ROOT, 'cache/html');

const USER_AGENT = 'epr_compliance-fetcher/0.1 (+https://github.com/aulvem/epr_compliance)';
const REQUEST_DELAY_MS = 2000;
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Load the canonical URL list from data/sources.json.
 * @returns {Promise<Array<{ id: string, url: string, source_language?: string }>>}
 */
async function loadSources() {
  // TODO: read SOURCES_FILE, JSON.parse, validate that every entry has id + url.
  //       Throw a descriptive error on malformed input — fetch.js must not
  //       silently skip records, or extract.js will operate on stale cache.
  throw new Error('not implemented');
}

/**
 * Fetch one URL and return a structured result. Non-2xx responses are
 * surfaced as { ok: false }, not thrown — orchestration must continue.
 * @param {string} url
 * @returns {Promise<{ ok: boolean, status: number, body: string, finalUrl: string, error?: string }>}
 */
async function fetchOne(url) {
  // TODO: undici.fetch(url, { headers: { 'User-Agent': USER_AGENT, ... },
  //       signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), redirect: 'follow' }).
  //       Capture res.status, res.url (post-redirect), and res.text().
  //       Treat AbortError, network error, and 4xx/5xx as ok=false with error reason.
  //       Some EPR / tariff sources serve PDF — detect Content-Type and either
  //       skip (let extract.js handle) or persist with .pdf suffix.
  throw new Error('not implemented');
}

/**
 * Persist HTML for one record to cache/html/{id}_{date}.html.
 * @param {string} id
 * @param {string} html
 * @param {string} date - ISO date in YYYY-MM-DD form
 * @returns {Promise<string>} absolute path written
 */
async function writeCache(id, html, date) {
  // TODO: mkdir -p CACHE_DIR; write `${id}_${date}.html` as utf8.
  //       Filename must be stable so extract.js can find the latest by glob.
  throw new Error('not implemented');
}

/**
 * Orchestrate a single fetch run.
 *  1. loadSources()
 *  2. for each entry: fetchOne(), then writeCache() on success
 *  3. write a per-run log to cache/html/_fetch_log_{date}.json
 *
 * Failure policy: a per-URL failure is logged but does not abort the run.
 * The process exits non-zero only if zero URLs succeeded (so the workflow
 * surfaces a complete outage, but tolerates partial network flakiness).
 */
async function main() {
  // TODO: implement orchestration.
  //  - Sleep REQUEST_DELAY_MS between requests (politeness, not throughput).
  //  - Use new Date().toISOString().slice(0, 10) for the date stamp.
  //  - Aggregate { id, url, status, ok, fetched_at, error? } into the log.
  //  - process.exit(succeeded === 0 ? 1 : 0).
  throw new Error('not implemented');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
