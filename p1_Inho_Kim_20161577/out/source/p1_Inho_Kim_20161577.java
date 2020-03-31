import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class p1_Inho_Kim_20161577 extends PApplet {

final String DEL_KEY = "DEL";
final String r_KEY = "r";
final String R_KEY = "R";
final String g_KEY = "g";
final String G_KEY = "G";
final String b_KEY = "b";
final String B_KEY = "B";

final HashMap<String, Integer> keys = new HashMap<String, Integer>();
boolean[] keyPress;

final String CIRCLE_SHAPE = "circle";
final String SQUARE_SHAPE = "square";
final String[] SHAPES = { CIRCLE_SHAPE, SQUARE_SHAPE };
int currentShape = 0;

final int BACKGROUND = 255;
int currentSize = 50;

public boolean isPressed(String key) {
  switch(key) {
    case DEL_KEY:
      return keyPress[keys.get(DEL_KEY)];
    case r_KEY:
    case R_KEY:
      return keyPress[keys.get(r_KEY)] || keyPress[keys.get(R_KEY)];
    case g_KEY:
    case G_KEY:
      return keyPress[keys.get(g_KEY)] || keyPress[keys.get(G_KEY)];
    case b_KEY:
    case B_KEY:
      return keyPress[keys.get(b_KEY)] || keyPress[keys.get(B_KEY)];
    default:
      return false;
  }
}

public void keyboardSetup() {
  int index = 0;
  keys.put(DEL_KEY, index++);
  keys.put(r_KEY, index++);
  keys.put(R_KEY, index++);
  keys.put(g_KEY, index++);
  keys.put(G_KEY, index++);
  keys.put(b_KEY, index++);
  keys.put(B_KEY, index++);
  
  keyPress = new boolean[keys.size()];
}

public void keyboardActions() {
  if (isPressed(DEL_KEY)) {
    clear();
    background(BACKGROUND);
  }
  else if(isPressed(R_KEY)) {
    fill(255, 0, 0);
  }
  else if(isPressed(G_KEY)) {
    fill(0, 255, 0);
  }
  else if(isPressed(B_KEY)) {
    fill(0, 0, 255);
  }
}

public void drawShape() {
  switch(SHAPES[currentShape]) {
    case CIRCLE_SHAPE:
      circle(mouseX, mouseY, currentSize);
      break;
    case SQUARE_SHAPE:
      square(mouseX, mouseY, currentSize);
      break;
  }
}

public void setup() {
  keyboardSetup();
  
  background(BACKGROUND);
  fill(0);
}

public void draw() {
  if (keyPressed) {
    keyboardActions();
  }
  
  if (mousePressed) {
    drawShape();
  }
}

public void keyPressed() {
  if (key == DELETE) {
    keyPress[keys.get(DEL_KEY)] = true;
  }
  if (key == 'r') {
    keyPress[keys.get(r_KEY)] = true;
  }
  if (key == 'R') {
    keyPress[keys.get(R_KEY)] = true;
  }
  if (key == 'g') {
    keyPress[keys.get(g_KEY)] = true;
  }
  if (key == 'G') {
    keyPress[keys.get(G_KEY)] = true;
  }
  if (key == 'b') {
    keyPress[keys.get(b_KEY)] = true;
  }
  if (key == 'B') {
    keyPress[keys.get(B_KEY)] = true;
  }
}

public void keyReleased() {
  if (key == DELETE) {
    keyPress[keys.get(DEL_KEY)] = false;
  }
  if (key == 'r') {
    keyPress[keys.get(r_KEY)] = false;
  }
  if (key == 'R') {
    keyPress[keys.get(R_KEY)] = false;
  }
  if (key == 'g') {
    keyPress[keys.get(g_KEY)] = false;
  }
  if (key == 'G') {
    keyPress[keys.get(G_KEY)] = false;
  }
  if (key == 'b') {
    keyPress[keys.get(b_KEY)] = false;
  }
  if (key == 'B') {
    keyPress[keys.get(B_KEY)] = false;
  }
}

public void mouseWheel (MouseEvent event) {
  final float rotation = event.getCount();
  if (rotation >= 0) {
    currentShape = (currentShape + 1) % SHAPES.length;
  }
  else {
    currentShape = (currentShape + SHAPES.length - 1) % SHAPES.length;
  }
  println(SHAPES[currentShape]);
}
  public void settings() {  size(600, 600); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "p1_Inho_Kim_20161577" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
