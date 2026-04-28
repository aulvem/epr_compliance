#!/usr/bin/env bash
# scripts/publish-hf.sh
#
# Upload hf/ to Hugging Face Datasets at Aulvem/epr-compliance.
#
# Prerequisites
#   1. pip install huggingface_hub                (one-time; ships the `hf` CLI)
#   2. Authenticate, either via env token:
#          export HF_TOKEN="hf_xxx..."            # write-scope token
#      or via interactive login:
#          hf auth login
#   3. Run from the repo root, NOT from scripts/.
#
# Usage
#   bash scripts/publish-hf.sh

set -euo pipefail

HF_USERNAME="Aulvem"
DATASET_NAME="epr-compliance"
HF_DIR="hf"
COMMIT_MSG="v0.1 initial release"

# --- preflight -------------------------------------------------------------

if [ ! -d "$HF_DIR" ]; then
  echo "ERROR: $HF_DIR/ not found. Run from repo root, not from scripts/." >&2
  exit 1
fi

# `hf` is the modern CLI shipped with huggingface_hub >= 0.34.
# `huggingface-cli` was deprecated in favor of `hf`.
if ! command -v hf >/dev/null 2>&1; then
  echo "ERROR: 'hf' CLI not found." >&2
  echo "  Install with: pip install huggingface_hub" >&2
  echo "  Then ensure the install location is on PATH (e.g., ~/.local/bin or pyXX/Scripts)." >&2
  exit 1
fi

# Token check: HF_TOKEN env wins; otherwise rely on a prior 'hf auth login'.
if [ -z "${HF_TOKEN:-}" ]; then
  if ! hf auth whoami >/dev/null 2>&1; then
    echo "ERROR: not authenticated to Hugging Face. Either:" >&2
    echo "  export HF_TOKEN=hf_xxx..." >&2
    echo "or:" >&2
    echo "  hf auth login" >&2
    exit 1
  fi
fi

# --- bit-identical sync check ---------------------------------------------
# Refuse to publish if the HF mirror has drifted from the canonical data/ tree.
# The HF dataset card (hf/README.md) is mirror-only and intentionally diverges
# from the GitHub README; only the data files must be byte-for-byte identical.

echo "Verifying data/ and hf/ are bit-identical..."
for f in epr_compliance_v0.1.json epr_compliance_v0.1.csv schema.json; do
  if ! cmp -s "data/$f" "hf/$f"; then
    echo "ERROR: data/$f and hf/$f differ. Aborting publish." >&2
    echo "Run: cp data/$f hf/$f to resync." >&2
    exit 1
  fi
done
echo "  data/ and hf/ verified bit-identical."

# --- upload ----------------------------------------------------------------

echo "Uploading $HF_DIR/ -> dataset $HF_USERNAME/$DATASET_NAME"
echo "Commit message: $COMMIT_MSG"
echo

hf upload "$HF_USERNAME/$DATASET_NAME" "$HF_DIR/" . \
  --repo-type dataset \
  --commit-message "$COMMIT_MSG"

echo
echo "Done. Dataset published at:"
echo "  https://huggingface.co/datasets/$HF_USERNAME/$DATASET_NAME"
