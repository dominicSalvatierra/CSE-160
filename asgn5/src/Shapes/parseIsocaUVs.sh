#!/opt/homebrew/bin/bash

if [[ "$1" == "none" ]]; then
    out="isocaUVs.js"
else
    out="$1"
fi

flag="$2"
tmp=$(mktemp)

echo "export const isocaUVs = ["  >"$out"
python3 ./createIsocaUVs.py > "$tmp"
sed -i '' 's/\[//g; s/, /,/g' "$tmp"
sed -i '' 's/\]/,/g' "$tmp"
cat "$tmp" >> "$out"
echo "];" >> "$out"

if (( flag == 1 )); then
    nano "$out"
fi

wc "$out"
pbcopy < "$out"
