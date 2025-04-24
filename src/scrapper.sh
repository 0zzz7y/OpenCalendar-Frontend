#!/usr/bin/env bash

# Usage: ./concat.sh [root_dir] [output_file]
# e.g. ./concat.sh . all_texts.txt

ROOT="${1:-.}"
OUTPUT="${2:-all_texts.txt}"

# Truncate (or create) the output file
: > "$OUTPUT"

# Find every file under ROOT, skip the output itself, and append its contents
find "$ROOT" -type f ! -path "$(realpath "$OUTPUT")" -print0 | while IFS= read -r -d '' file; do
  echo "=== Begin: $file ===" >> "$OUTPUT"
  cat "$file"             >> "$OUTPUT"
  echo -e "\n=== End:   $file ===\n" >> "$OUTPUT"
done
