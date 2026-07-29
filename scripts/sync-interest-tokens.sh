#!/bin/sh
set -eu

webapp_root=$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)
interest_root=${INTEREST_APP_ROOT:-"$webapp_root/../itdagene-interest"}
source_file="$webapp_root/styles/tokens.css"
target_file="$interest_root/src/styles/tokens.css"

if [ ! -f "$target_file" ]; then
  echo "Interest app tokens were not found at $target_file" >&2
  exit 1
fi

if [ "${1:-}" = "--check" ]; then
  if cmp -s "$source_file" "$target_file"; then
    echo "Design tokens are synchronized."
    exit 0
  fi
  echo "Design tokens differ. Run yarn tokens:sync from itdagene-webapp." >&2
  exit 1
fi

cp "$source_file" "$target_file"
echo "Updated $target_file"
