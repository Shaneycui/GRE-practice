#!/usr/bin/env bash
set -euo pipefail
if [ "$#" -ne 1 ]; then echo 'Usage: bash scripts/render-pages.sh /path/to/book.pdf' >&2; exit 1; fi
command -v pdftoppm >/dev/null || { echo 'Please install Poppler (pdftoppm) first.' >&2; exit 1; }
repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$repo_dir/dist/pages"
pdftoppm -f 13 -l 419 -scale-to 1550 -jpeg -jpegopt quality=72 "$1" "$repo_dir/dist/pages/p"
echo 'Pages saved to dist/pages/'
