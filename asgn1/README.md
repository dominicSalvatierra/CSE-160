.css files:
- All css files are contained in my CSS folder in src. Files include:
  - document.css: to control my font and general appearance display
  - slideButtonStyle.css: to style my buttons and sliders.
  - cursor.css: to style my cursor
- some code was copy and pasted from websites (links provided below) to give me a starting template of 
  stylization to modify

.js modifications:
- handleClicks() renamed as click() in .js file
- Additional Functionality in my .js file:
  - setupPageStyle(): sets up event listener for cursor color synchronization with RGB sliders
  - updateCursorColor(): helper function for updating my cursor color
  - deleteBrushStroke(): pops the last point off from the shapes list, and renders updated points
  - addActionsForHtmlUI(): helper function for reading UI interactions. Implemented by professor in videos

shape files:
- Point.js stores class for square UI button
- Circle.js stores class for square UI button
- Triangle.js stores class for square UI button

instruction 13 - drawing:
- I added three methods to my triangle class: 
  - renderDrawing() paints my picture
  - randomizeColor() is a helper function that randomizes the color of my drawing's triangles
  - findSign() is a helper function for my drawing algorithm
- In my .js file, I added paintStars() to create a randomized backdrop of stars behind my main object

Resources:
- Sources to help me understand and apply .css code to style my wepage
  - w3school: for styling my sliders
  - 2020 CSE 160 Youtube Helper Videos: I watched all the videos to set up my code. Because of this, much of my code from instructions 1 - 11 match the code that the professor writes in the helper videos. 
  - ChatGPT: to streamline my understanding of HTML, Javascript, and CSS. I am still fairly new to these languages (first time using these languages regularly), so I am using ChatGPT to assist my understanding.

  - Math.random(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  - https://www.w3schools.com/css/css_font.asp
  - https://www.w3schools.com/howto/howto_js_rangeslider.asp
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/buttonLinks
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/rangeLinks
  - https://www.w3schools.com/html/html_images.asp


