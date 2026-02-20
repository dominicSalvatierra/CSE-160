UI: 
- 3 buttons to generate three different mazes
- click to add a column of blocks. shift + click to delete a column of blocks
- use mouse to rotate camera when hovering in the canvas
- add / delete functionality is disabled when in maze modes

.css files:
- N/A

asg3.js:
- Additional Functionality in my .js file:
  - addActionsForHtmlUI(): in my "canvas.addEventListener("mousemove", (ev) .." event listener, you can 
    toggle pitch / tilt on my camera by switching between 0 and 1 in the second parameter of my onMove()

- I generate 2D terrain maps using a random generator that creates element values between 1 and 4, inclusive. maze.js receives its own terrains maps. 

- my animal is generated in all 4 maps - that is, the primary map, and the three mazes. In the primary map, the animals are located at all four corners. In my mazes, they are located at the corner across the diagonal from where the camera is spawned. In the mazes, the animals mark the end points. 

class files:
- penguin.js: conform the penguin to the position, scale, and rotation through the following class function: wholeBodyTransform(scale, posx,posy,posz, rotX,rotY,rotZ). posx, posy, posz refers to translation, and rotX, for example, rotates the penguin body on the X axis

- maze.js: this file contains the terrain and maze maps needed to render my 3 mazes. I must create a Maze class in order to render the mazes. from my asg3.js, I can call the class's render functions. 

Resources:
  - 2020 CSE 160 Youtube Helper Videos: I watched all the videos to set up my code.
  - ChatGPT: 
    - to streamline my understanding of HTML and Javascript syntax. I am still fairly new to these languages (first time using these languages regularly), so I am using ChatGPT to assist my understanding. 
    - I used ChatGPT to generate the maze maps that are contained in my maze.js file. 
  