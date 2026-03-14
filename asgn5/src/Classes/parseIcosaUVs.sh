#!/opt/homebrew/bin/bash

if [[ "$1" == "" ]]; then
    out="template_icosaUVs.js"
else
    out="$1"
fi

flag="$2"
tmp=$(mktemp)

echo "export const icosaUVs = [" > "$out"
python3 createIcosaUVs.py > "$tmp"
sed -i '' 's/\[//g; s/, /,/g' "$tmp"
sed -i '' 's/\]/,/g' "$tmp"
cat "$tmp" >> "$out"
echo "];" >> "$out"

if (( flag == 1 )); then
    nano "$out"
fi

wc "$out"
pbcopy < "$out"
