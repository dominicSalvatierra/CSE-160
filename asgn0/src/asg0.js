
let canvas, ctx;
let x_origin, y_origin;
let x_offset = 10; // original = 120
let y_offset = 10; // original = 10
let rec_height = 340; //original = 150
let rec_width = 340; // original = 150

function makeRect() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  x_origin = x_offset + rec_width / 2;
  y_origin = y_offset + rec_height / 2;
  ctx.fillRect(x_offset, y_offset, rec_height, rec_width);
}

// handle drawing a new element
function drawVector(v, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x_origin, y_origin);
  p2x = x_origin + v.elements[0] * 20;
  p2y = y_origin - v.elements[1] * 20;
  
  //first if-else chain accounts for vector x-wise out-of-bounds 
  if (p2x < x_origin - rec_width / 2) {
    p2x = x_origin - rec_width / 2;
  }
  else if (p2x > x_origin + rec_width / 2) {
    p2x = x_origin + rec_width / 2;
  }
  //next if-else chain accounts for vector y-wise out-of-bounds 
  if (p2y < y_origin - rec_height / 2) {
    p2y = y_origin - rec_height / 2;
  }
  else if (p2y > y_origin + rec_width / 2) {
    p2y = y_origin + rec_width / 2;
  }
  ctx.lineTo(p2x, p2y);
  ctx.stroke();
} //caketidgetHome716

function handleDrawEvent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  makeRect();
  //get vector1's endpoints 
  let vu1_x = Number(document.getElementById("v1_x").value); 
  let vu1_y = Number(document.getElementById("v1_y").value); 
  //get vector2's endpoints 
  let vu2_x = Number(document.getElementById("v2_x").value); 
  let vu2_y = Number(document.getElementById("v2_y").value);
  //create vector1 and vector2 
  let vu1 = new Vector3([vu1_x,vu1_y,0]);
  let vu2 = new Vector3([vu2_x,vu2_y,0]);
  drawVector(vu1, 'red');
  drawVector(vu2, 'blue');
} 

function angleBetween(v1, v2) {
  v1_mgn = v1.magnitude();
  v2_mgn = v2.magnitude();
  if (v1_mgn !== 0 && v2_mgn !== 0) {
    angle_rad = Math.acos(Vector3.dot(v1, v2) / (v1_mgn * v2_mgn));
    return angle_rad * (180 / Math.PI);
  } 
  else {
    return -1;
  }
}

function handleDrawOperationEvent() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  makeRect();
  //get vector1's endpoints 
  let vu1_x = Number(document.getElementById("v1_x").value); 
  let vu1_y = Number(document.getElementById("v1_y").value); 
  //get vector2's endpoints 
  let vu2_x = Number(document.getElementById("v2_x").value); 
  let vu2_y = Number(document.getElementById("v2_y").value);
  //create vector1 and vector2 
  let vu1 = new Vector3([vu1_x,vu1_y,0]);
  let vu2 = new Vector3([vu2_x,vu2_y,0]);
  drawVector(vu1, 'red');
  drawVector(vu2, 'blue');
  
  let op = document.getElementById("select_op").value; 
  if (op === "add") {
    vu1.add(vu2);
    drawVector(vu1, 'green');
  }
  else if (op === "sub") {
    vu1.sub(vu2);
    drawVector(vu1, 'green');
  }
  else if (op === "mult") {
    let s = Number(document.getElementById("scalar").value);
    vu1.mul(s);
    vu2.mul(s);
    drawVector(vu1, 'green');
    drawVector(vu2, 'green');
  }
  else if (op === "div") {
    let s = Number(document.getElementById("scalar").value);
    vu1.div(s);
    vu2.div(s);
    drawVector(vu1, 'green');
    drawVector(vu2, 'green');
  }
  else if (op === "Angle between") {
    let angle = angleBetween(vu1, vu2);
    if (angle > 0) {
      console.log("Angle: " + angle);
    }
    else {
      console.log("Angle: undefined");
    }
  }
  else if (op === "area") {
    /*// get angle
    let angle = angleBetween(vu1, vu2);
    // if both vectors are nonzero ...
    if (0 < angle && angle < 180) {
      //v1 cross v2 = ||v1|| ||v2|| sin(angle)
      //convert angle to radians
      angle = angle * (Math.PI / 180);
      product = vu1.magnitude() * vu2.magnitude() * Math.sin(angle);
      console.log("Area of triangle: " + (product / 2));
    }
    else {
      console.log("Area of triangle: " + 0);
    }*/
    let v_cross = new Vector3();
    v_cross = Vector3.cross(vu1, vu2);
    //console.log(v_cross);
    //console.log(v_cross.magnitude());
    console.log("Area of triangle: " + v_cross.magnitude() / 2);
  }
  else if (op === "magnitude") {
    console.log("Magnitude v1: " + vu1.magnitude());
    console.log("Magnitude v2: " + vu2.magnitude());
  }
  else if (op === "normalize") {
    drawVector(vu1.normalize(), 'green');
    drawVector(vu2.normalize(), 'green');
  }
}

// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  makeRect();       // Fill a rectangle with the color

  let v1 = new Vector3([2,2,0]);
  drawVector(v1, 'red');
}