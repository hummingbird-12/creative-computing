// Keyboard
final char DEL = 127; // DEL
final char SPACE = 32; // SPACE
final char[] KEYS = { 'r', 'R', 'g', 'G', 'b', 'B', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', DEL, SPACE };
final HashMap<Character, Boolean> keyPress = new HashMap<Character, Boolean>();

// Canvas
final int BACKGROUND = 204;

final int CANVAS_OFFSET = 50;
final int CANVAS_OFFSET_TOP = 0;
final int CANVAS_OFFSET_RIGHT = CANVAS_OFFSET * 3;
final int CANVAS_OFFSET_BOTTOM = 0;
final int CANVAS_OFFSET_LEFT = 0;

// Brush shape
enum SHAPES { _CIRCLE, _SQUARE };
SHAPES currentShape = SHAPES._CIRCLE;

// Fill color
final int COLOR_STEP = 3;
int currentColorR = 0;
int currentColorG = 0;
int currentColorB = 0;

// Brush size
final int MAX_SIZE = 50;
final int MIN_SIZE = 5;
final int SIZE_STEP = 5;
int currentSize = 50;

// Fonts
PFont normalFont;
PFont boldFont;

/*** CANVAS-RELATED FUNCTIONS - START ***/

// Calculates the width of the canvas
int getCanvasWidth() {
  return width - CANVAS_OFFSET_LEFT - CANVAS_OFFSET_RIGHT;
}

// Calculates the height of the canvas
int getCanvasHeight() {
  return height - CANVAS_OFFSET_TOP - CANVAS_OFFSET_BOTTOM;
}

// Determines whether the mouse has left the canvas area
boolean isMouseOnCanvas() {
  // The mouse coordinate within the canvas
  final int _mouseX = mouseX - CANVAS_OFFSET_LEFT;
  final int _mouseY = mouseY - CANVAS_OFFSET_TOP;
  // The canvas's dimension
  final int canvasWidth = getCanvasWidth();
  final int canvasHeight = getCanvasHeight();
  
  // Check whether the mouse has left the canvas
  return !(_mouseX < 0 || _mouseX > canvasWidth ||
    _mouseY < 0 || _mouseY > canvasHeight);
}

// Initializes the canvas with the side bar
void setupCanvas() {  
  clearCanvas();
  drawSideBar();
}

// Clears the content of the canvas
void clearCanvas() {
  // Canvas area
  final int canvasX = CANVAS_OFFSET_LEFT;
  final int canvasY = CANVAS_OFFSET_TOP;
  final int canvasWidth = getCanvasWidth();
  final int canvasHeight = getCanvasHeight();
  
  // Draw the canvas
  fill(255);
  rectMode(CORNER);
  rect(canvasX, canvasY, canvasWidth, canvasHeight);
  rectMode(CENTER);
}

// Set the fill color to the current color configuration
void setCurrentFill() {
  fill(currentColorR, currentColorG, currentColorB);
}

// Draw the side bar
void drawSideBar() {
  // Draw the side bar's background
  fill(BACKGROUND);
  rectMode(CORNER);
  rect(getCanvasWidth(), 0, CANVAS_OFFSET_RIGHT, height);
  rectMode(CENTER);
  
  // Write text "Current brush"
  final String cursorIndicator = "Current brush";
  fill(0);
  textAlign(CENTER);
  textFont(boldFont);
  text(cursorIndicator, width - CANVAS_OFFSET_RIGHT / 2, height - CANVAS_OFFSET * 3);
  textFont(normalFont);
  
  // Update the current brush shown on the side bar
  updateCurrentBrush();
}

// Update the coordinate of the mouse shown on the side bar
void updateMouseCoordinate() {
  // The text area to show the mouse coordinate
  final int textAreaX = getCanvasWidth() + 5;
  final int textAreaY = height - 20;
  final int textAreaWidth = 100;
  final int textAreaHeight = 20;
  
  // Clear the text area
  fill(BACKGROUND);
  rectMode(CORNER);
  rect(textAreaX, textAreaY, textAreaWidth, textAreaHeight);
  rectMode(CENTER);
  
  // Check whether the mouse has left the canvas
  if (!isMouseOnCanvas()) {
    return;
  }
  
  // The mouse coordinate within the canvas
  final int _mouseX = mouseX - CANVAS_OFFSET_LEFT;
  final int _mouseY = mouseY - CANVAS_OFFSET_TOP;
  
  // Draw the updated mouse coordinate
  final String coordinate = String.format("(%d,%d)", _mouseX, _mouseY);
  fill(0);
  rectMode(CORNER);
  textAlign(BASELINE);
  text(coordinate, textAreaX, textAreaY, textAreaWidth, textAreaHeight);
  rectMode(CENTER);
}

/*** CANVAS-RELATED FUNCTIONS - END ***/


/*** KEYBOARD-RELATED FUNCTIONS - START ***/

// Initialize the `keyPress` HashMap with false to all keys
void setupKeyboard() {
  for (int i = 0; i < KEYS.length; i++) {
    keyPress.put(KEYS[i], false);
  }
}

// Check whether a key has been pressed
boolean isKeyPressed(final char _key) {
  return keyPress.get(_key);
}

// Define actions for when each of the keys is pressed
void keyboardActions() {
  // DEL: clear the canvas
  if (isKeyPressed(DEL)) {
    clearCanvas();
  }
  // SPACE: change the brush shape
  else if (isKeyPressed(SPACE)) {
    currentShape = currentShape == SHAPES._CIRCLE ? SHAPES._SQUARE : SHAPES._CIRCLE;
  }
  // r: reduce the current brush's R channel
  else if (isKeyPressed('r')) {
    currentColorR = max(currentColorR - COLOR_STEP, 0);
  }
  // R: increase the current brush's R channel
  else if (isKeyPressed('R')) {
    currentColorR = min(currentColorR + COLOR_STEP, 255);
  }
  // g: reduce the current brush's G channel
  else if (isKeyPressed('g')) {
    currentColorG = max(currentColorG - COLOR_STEP, 0);
  }
  // G: increase the current brush's G channel
  else if (isKeyPressed('G')) {
    currentColorG = min(currentColorG + COLOR_STEP, 255);
  }
  // b: reduce the current brush's B channel
  else if (isKeyPressed('b')) {
    currentColorB = max(currentColorB - COLOR_STEP, 0);
  }
  // B: increase the current brush's B channel
  else if (isKeyPressed('B')) {
    currentColorB = min(currentColorB + COLOR_STEP, 255);
  }
  // 1: set current brush to red
  else if (isKeyPressed('1')) {
    currentColorR = 255;
    currentColorG = 0;
    currentColorB = 0;
  }
  // 2: set current brush to orange
  else if (isKeyPressed('2')) {
    currentColorR = 255;
    currentColorG = 165;
    currentColorB = 0;
  }
  // 3: set current brush to yellow
  else if (isKeyPressed('3')) {
    currentColorR = 255;
    currentColorG = 255;
    currentColorB = 0;
  }
  // 4: set current brush to green
  else if (isKeyPressed('4')) {
    currentColorR = 0;
    currentColorG = 255;
    currentColorB = 0;
  }
  // 5: set current brush to blue
  else if (isKeyPressed('5')) {
    currentColorR = 0;
    currentColorG = 0;
    currentColorB = 255;
  }
  // 6: set current brush to indigo
  else if (isKeyPressed('6')) {
    currentColorR = 75;
    currentColorG = 0;
    currentColorB = 130;
  }
  // 7: set current brush to violet
  else if (isKeyPressed('7')) {
    currentColorR = 238;
    currentColorG = 130;
    currentColorB = 238;
  }
  // 8: set current brush to gray
  else if (isKeyPressed('8')) {
    currentColorR = 128;
    currentColorG = 128;
    currentColorB = 128;
  }
  // 9: set current brush to white
  else if (isKeyPressed('9')) {
    currentColorR = 255;
    currentColorG = 255;
    currentColorB = 255;
  }
  // 0: set current brush to black
  else if (isKeyPressed('0')) {
    currentColorR = 0;
    currentColorG = 0;
    currentColorB = 0;
  }
  
  // Update the current brush shown on the side bar
  updateCurrentBrush();
}

/*** KEYBOARD-RELATED FUNCTIONS - END ***/


/*** MOUSE-RELATED FUNCTIONS - START ***/

// Define actions for when mouse wheel event is detected
void mouseWheelActions(final boolean upwards) {
  // Upwards: increase the size of the brush
  if (upwards) {
    currentSize = min(currentSize + SIZE_STEP, MAX_SIZE);
  }
  // Downwards: decrease the size of the brush
  else {
    currentSize = max(currentSize - SIZE_STEP, MIN_SIZE);
  }
  // Update the current brush shown on the side bar
  updateCurrentBrush();
}

/*** MOUSE-RELATED FUNCTIONS - END ***/


/*** DRAW-RELATED FUNCTIONS - START ***/

// Update the current brush state shown on the side bar
void updateCurrentBrush() {
  // Define the area to show the current brush state
  final int offsetFromText = 20;
  final int brushAreaCenterX = width - CANVAS_OFFSET_RIGHT / 2;
  final int brushAreaCenterY = height - CANVAS_OFFSET * 3 + offsetFromText + MAX_SIZE / 2;
  
  // Clear the current brush area
  fill(BACKGROUND);
  square(brushAreaCenterX, brushAreaCenterY, MAX_SIZE);
  
  // Draw the updated current brush
  setCurrentFill();
  switch (currentShape) {
    case _CIRCLE:
      circle(brushAreaCenterX, brushAreaCenterY, currentSize);
      break;
    case _SQUARE:
      square(brushAreaCenterX, brushAreaCenterY, currentSize);
      break;
  }
}

// Draw the shape according to current brush
void drawShape() {
  // Check whether the mouse has left the canvas
  if (!isMouseOnCanvas()) {
    return;
  }
  
  // Draw
  setCurrentFill();
  switch (currentShape) {
    case _CIRCLE:
      circle(mouseX, mouseY, currentSize);
      break;
    case _SQUARE:
      square(mouseX, mouseY, currentSize);
      break;
  }
}

/*** DRAW-RELATED FUNCTIONS - END ***/


/*** PROCESSING FUNCTIONS - START ***/

// Setup the environment of Processing app
void setup() {
  size(1280, 720); // Window size
  cursor(CROSS); // Cursor type
  noStroke(); // Remove stroke
  rectMode(CENTER); // Mode for providing parameters for rectangles
  
  // Define fonts
  boldFont = createFont("Arial Bold", 14);
  normalFont = createFont("Arial", 12);
  textFont(normalFont);
  
  // Initialization
  setupKeyboard();
  setupCanvas();
  updateCurrentBrush();
}

// Draw each frame
void draw() {  
  if (mousePressed) {
    drawShape();
    drawSideBar();
  }
}

// Handle key press events
void keyPressed() {
  for (int i = 0; i < KEYS.length; i++) {
    if (key == KEYS[i]) {
      keyPress.put(key, true);
    }
  }
  keyboardActions();
}

// Handle key release events
void keyReleased() {
  for (int i = 0; i < KEYS.length; i++) {
    if (key == KEYS[i]) {
      keyPress.put(key, false);
    }
  }
}

// Handle mouse move events
void mouseMoved() {
  updateMouseCoordinate();
}

// Handle mouse wheel events
void mouseWheel(MouseEvent event) {
  final float rotation = event.getCount();
  if (rotation >= 0) { // Downwards
    mouseWheelActions(false);
  }
  else { // Upwards
    mouseWheelActions(true);
  }
}

/*** PROCESSING FUNCTIONS - END ***/
