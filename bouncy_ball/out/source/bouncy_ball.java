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

public class bouncy_ball extends PApplet {

int sizeX = 600;
int sizeY = 800;

public void setup() {
  
  background(255);
}

float coordX = random(sizeX/3, sizeX/2);
float coordY = random(sizeY/3, sizeY/2);
int directionX = 1;
int directionY = 1;
int speed = 5;
int ballSize = 50;
int radius = ballSize / 2;

public void draw() { // continuously called
  clear();
  background(255);
  fill(0);
  ellipse(coordX, coordY, ballSize, ballSize);
  coordX += directionX * speed;
  coordY += directionY * speed;
  
  if (coordX + radius >= sizeX) {
    coordX = sizeX - radius;
    directionX = -1;
  }
  if (coordY + radius >= sizeY) {
    coordY = sizeY - radius;
    directionY = -1;
  }
  if (coordX - radius <= 0) {
    coordX = 0 + radius;
    directionX = 1;
  }
  if (coordY - radius <= 0) {
    coordY = 0 + radius;
    directionY = 1;
  }
}
  public void settings() {  size(600, 800); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "bouncy_ball" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
