// scripts/diff.js
//
// Compare the freshly extracted dataset to the prior weekly snapshot and emit
// a Markdown summary suitable for use as a GitHub PR body.
//
// Inputs:
//   data/epr_compliance_v0.1.json            — current (just produced by extract.js)
//   data/epr_compliance_v0.1.previous.json   — snapshot from the prior weekly run
//                                              (the workflow copies current → previous
//                                              BEFORE running extract.js, so this file
//                                              always exists at diff time)
//
// Output:
//   cache/diff_{YYYY-MM-DD}.md               — consumed by the create-pull-request action
//                                              via its body-path input
//
// Usage: node scripts/diff.js
//
// SKELETON ONLY.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CURRENT_FILE  = resolve(ROOT, 'data/epr_compliance_v0.1.json');
const PREVIOUS_FILE = resolve(ROOT, 'data/epr_compliance_v0.1.previous.json');
const OUT_DIR       = resolve(ROOT, 'cache');

// Fields whose value changes every run on their own (e.g., the date stamp) and
// must be excluded from material-change detection.
const NOISE_PATHS = new Set(['last_checked_at', 'threshold_value_jpy_estimate']);

/**
 * Index records by id for O(1) lookup.
 * @param {{ records: Array<{ id: string }> }} dataset
 * @returns {Map<string, object>}
 */
function indexById(dataset) {
  // TODO: build and return Map<id, record>. Tolerate dataset.records === undefined
  //       (return an empty Map) so a missing previous file does not crash the run.
  throw new Error('not implemented');
}

/**
 * Compute the per-record field-level diff via deep walk.
 * @param {object} prev
 * @param {object} next
 * @returns {Array<{ path: string, before: unknown, after: unknown }>}
 */
function diffRecord(prev, next) {
  // TODO: recurse through both objects in parallel; emit one entry per leaf
  //       difference; skip paths in NOISE_PATHS; for arrays, compare via
  //       JSON.stringify (order-sensitive) to surface reorderings as changes.
  //       Bonus: highlight record_type changes (these indicate misclassification
  //       and warrant a manual review flag in the rendered diff).
  throw new Error('not implemented');
}

/**
 * Render the comparison as a Markdown document for a PR body.
 * @param {{
 *   added:   Array<object>,
 *   removed: Array<object>,
 *   changed: Array<{ id: string, name: string, changes: Array<object> }>
 * }} args
 * @returns {string}
 */
function renderMarkdown({ added, removed, changed }) {
  // TODO: emit:
  //   # epr_compliance diff — {YYYY-MM-DD}
  //   - Added: N, Removed: N, Changed: N
  //   ## Added       (one bullet per record: `id` — country_name_en — record_type)
  //   ## Removed     (same shape)
  //   ## Changed — `id` (name)   (one sub-section per record, one bullet per field)
  // Truncate string values >80 chars; render via JSON.stringify in backticks.
  // If everything is empty, return "_No material changes this run._" verbatim.
  throw new Error('not implemented');
}

/**
 * Orchestrate one diff run.
 *  1. read CURRENT_FILE and PREVIOUS_FILE (treat missing previous as
 *     "everything is added").
 *  2. classify ids into added / removed / common.
 *  3. for each common id: diffRecord; keep only those with non-empty diffs.
 *  4. render → write to cache/diff_{date}.md → mkdir -p OUT_DIR first.
 *  5. print the absolute output path on stdout (workflow captures it for
 *     the PR body).
 */
async function main() {
  // TODO: implement orchestration. Exit code is always 0 on success, even if
  //       there are no diffs — a "no changes" run is a valid result, not an error.
  //       The workflow gates PR creation on the body file's content, not exit code.
  throw new Error('not implemented');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
