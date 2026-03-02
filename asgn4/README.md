UI: 
- the keys 1-2-3-4 are available to enable / disable the button functionality when pointer locked
- Sliders self-explanatory

.CSS FILES:
- N/A

ASGN4.JS:
- Additional Functionality in my .js file:
  - addActionsForHtmlUI(): in my "canvas.addEventListener("mousemove", (ev) .." event listener, you can 
    toggle pitch / tilt on my camera by switching between 0 and 1 in the second parameter of my onMove()

CLASS FILES:
-sphere.js: I wrote a bash script to write my sphere coordinates to a file that my Sphere class then accesses for the vertices, uvs, and normals:

-sphereVertices.js: contains my python generated sphere coordinates

- the following is my bash file to generate my sphere coordinates
'''
#!/opt/homebrew/bin/bash

if [[ "$1" == "none" ]]; then
    out="../CSE-160/asgn4/src/Shapes/sphereVertices.js"
else
    out="$1"
fi

flag="$2"
tmp=$(mktemp)

echo "export const SPHERE_POSITIONS = new Float32Array([" > "$out"
python3 ./generateSphereCoords.py > "$tmp"
sed -i '' 's/\[//g; s/, /,/g' "$tmp"
sed -i '' 's/\]/,/g' "$tmp"
cat "$tmp" >> "$out"
echo "]);" >> "$out"

if (( flag == 1 )); then
    nano "$out"
fi

wc "$out"
pbcopy < "$out"
'''

OTHER FILES: 
- Untitled.obj contains the vase coordinates from our Blender lab. 

- Model.js was slightly reconfigured from Blender lab

RESOURCES:
  - 2020 CSE 160 Youtube Helper Videos: I watched all the videos to set up my code.
  - ChatGPT: 
    - to streamline my understanding of HTML and Javascript syntax. I am still fairly new to these languages (first time using these languages regularly), so I am using ChatGPT to assist my understanding. 
    - I used ChatGPT to generate my pointer lock code, and to assist with implementing correctly my Model.js and Untitled.obj file into my asgn4 javascript
  - https://www.youtube.com/watch?v=7VN4QqOtvt0
    - I used this video to implement my spotlight correctly
  