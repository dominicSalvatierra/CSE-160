UI: 
- 'Press 'C' to toggle between the Pointer Lock and Orbit Controls. W-A-S-D keys controls forward-left-backwards-right movements when in Pointer Lock. 'esc' can also be pressed to unlock from Pointer Controls and enable Orbit Controls.
- Once in the second scene, the user can exit by pressing the key 'O' and return to the original scene

.CSS FILES:
- N/A

ASGN5.JS:
- addSkyBox() implements my surrounding environment in both scenes.
- addLattice() incorporates my custom shape
- addObjects() uploads and adds my Blender object to the scenes
    - material loader loads a rusty metal downloaded from https://polyhaven.com
    - my texture is tinted red for a more horror look
- addScene02Shapes() implements my primitive shapes:
    - Square: used as center shapes in scene 0 and 2
    - Cylinder: generated within the center square shape in scene 0 and 2
    - Isocahedron: scene 2, look around and up to spot the shapes peeking out of walls with horror texture on them. There
      should be one on each wall
    - Pyramid: self implemented shape that make four suspended pathways in scenes 0 and 2
- addLights() implement my lights in both my scenes
    - Point light sources: (1) at center, and (1) tracking with my imported object as it rises up abyss
    - Ambient light: (1) in scene two to lift the shadows around my object
    - Spot light: (1) that is turned on and off with 'F' key. Direction is from camera to at point

CLASS FILES:
-my custom shape is modularized into my createPyramidGeometry.js


OTHER FILES: 
- Mainframe.obj contains the object coordinates exported from Blender. Texture is a rusty metal that is tinted red

RESOURCES:
  - ChatGPT: 
    - to streamline my understanding of HTML and Javascript syntax, and three.js functionality. I am still fairly new to these languages (first time using these languages regularly), so I am using ChatGPT to assist my understanding.
  - Google Search
    - to streamline my understanding of three.js functionality. I mostly referenced the AI output at the top of results.
  - https://threejs.org/docs/
  - https://threejs.org/manual/

  