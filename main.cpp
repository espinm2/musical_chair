#define _USE_MATH_DEFINES
#include <math.h>
#include <cstdlib>
#include <fstream>
#include <vector>
#include <string>
#include <stdio.h>
#include <sstream>
#include "image.h"
#include "furniture.h"
#include "MersenneTwister.h"

// ===================================================================================================
// ===================================================================================================
const unsigned int  TEXTURE_SIZE_X = 512;
const unsigned int  TEXTURE_SIZE_Y = 512;
const unsigned int  DESK_WIDTH     = 35;
const unsigned int  DESK_LENGTH    = 35;
const unsigned int  BLACK_THRESH   = 1;
const unsigned int  LIGHT_GOODNESS = 1;
// ===================================================================================================
// ===================================================================================================
void loadFurnitureState(std::ifstream & in_str,  std::vector<Furniture> & fVec, int & itemCount);
void saveFurnitureState(std::ofstream & out_str, std::vector<Furniture> & fVec, int & itemCount);
void setupInitalRandomPos(std::vector<Furniture> &  fVec, Image<Color> & texture);
Color getApproxColor(Furniture& item, Image<Color>& texture);
bool insideSpace(Furniture& item, Image<Color>& texture);
bool inRange(float x, float y);
void deskMove(Furniture& item,double heat,Image<Color> & texture);
// ===================================================================================================
// ===================================================================================================
double calculateCost(std::vector<Furniture> & fVec, Image<Color> &  texture);
void swapLocation(Furniture& a, Furniture& b);

std::string convertInt(int number)
{
   std::stringstream ss;//create a stringstream
   ss << number;//add number to the stream
   return ss.str();//return a string with the contents of the stream
}
// ===================================================================================================
// ===================================================================================================
void usage(char* executable) {
  std::cerr << " usage " << executable << " floor_image.ppm states.st start"<< std::endl;
  std::cerr << " usage " << executable << " floor_image.ppm states.st step"<< std::endl;
}

// ===================================================================================================
// ===================================================================================================

int main(int argc, char* argv[]) {

  // spit out error if less then two elements
  if (argc < 3) { usage(argv[0]); exit(1); }

  // Load ppm image of floor textures to use
  Image<Color> floor_texture;
  std::string image_file = std::string(argv[1]);
  std::cout << "Loading " << argv[1] << std::endl;
  floor_texture.Load(image_file);

  // Load in location of furniture
  std::ifstream in_str(argv[2]);
  
  // Is this file is good
  if (!in_str.good()) {
      std::cerr << "Can't open " << argv[2] << " to read.\n";
      exit(1);
  }

 
  //Load into vector as furnature objects
  std::vector<Furniture> furnitureVec;
  int itemCount = 0;
  loadFurnitureState(in_str,furnitureVec, itemCount);

  // INITAL RANDOMIZATION
  if(std::string(argv[3])=="start"){
    std::cout << "Initial Randomization" << std::endl;
    setupInitalRandomPos(furnitureVec,floor_texture);
    // is file good to write
    std::ofstream out_str(argv[2]);
    if (!out_str.good()) {
      std::cerr << "Can't open " << argv[4] << " to write.\n";
      exit(1);
    } 
    saveFurnitureState(out_str,furnitureVec, itemCount);
    return 0;
  }

  // Randomly moves my furniture until they are in good starting positions
  std::cout <<"OLD COST " <<calculateCost(furnitureVec, floor_texture) << std::endl;
  std::cout << furnitureVec.size() <<std::endl;
  
  double current_cost = calculateCost(furnitureVec, floor_texture);
  unsigned int HEAT = 100;
  unsigned int SAVES = 0;

  while(0 < HEAT){
    for(int i = 0; i < furnitureVec.size(); i ++){
      
      Furniture curItem = furnitureVec[i];
      float orginal_x = curItem.getPos().x;
      float orginal_y = curItem.getPos().y;


      // try and jitter cur item, this will change the value
      deskMove(furnitureVec[i],HEAT,floor_texture);

      // check new cost
      double new_cost = calculateCost(furnitureVec, floor_texture);

      // I got a better cost
      if(new_cost < current_cost){
        current_cost = new_cost;

      // I did worst
      }else{
        // place item back
        furnitureVec[i].setPos(orginal_x,orginal_y);
      }

    }//for
    HEAT--;

    if(HEAT%5 == 0){
      
      std::string save_str = convertInt(SAVES);
      save_str = "saved_state_" + save_str + ".st";
      const char *cstr = save_str.c_str();
      std::ofstream out_str(cstr);
      if (!out_str.good()) {
        std::cerr << "Can't open " << argv[2] << " to write.\n";
        exit(1);
      }
      saveFurnitureState(out_str,furnitureVec, itemCount);
      out_str.close();
      SAVES++;

    }//sav

  }//while


}//main

// ===================================================================================================
// ===================================================================================================

double calculateCost(std::vector<Furniture> & fVec, Image<Color>& texture){
  // This function will calculate the total cost of a function

  double cost = 0;
  // Postive Cost == MORE LIGHT
  // Negative Cost == LESS LIGHT

  // For each item
  for(int i = 0; i < fVec.size(); i++){
    Furniture curItem = fVec[i];

    // How much white am I under
    Color white = getApproxColor(curItem,texture);

    // They should all the black/white(from 0 - 256)
    cost -= (int)white.r;

    // How near I am I to everyone else
    for(int j = 0; j < fVec.size(); j++){

      // avoid self
      if( i == j ) { continue; }

      Furniture otherItem = fVec[j];

      double dist = sqrt(
          pow((curItem.getPos().x - otherItem.getPos().x),2)+
          pow((curItem.getPos().y - otherItem.getPos().y),2));

      double radius = DESK_LENGTH/2.0;
      
      // I'm too close to the point
      if(dist < 2 * radius){
        // FIXME good lighting shouldn't mean overlap;
        cost += 2*256;
      }else{

        cost += dist * 0.01;
        



      }//ifsel
      
    }//innerfor
  }//outfor
  return cost;
}

void setupInitalRandomPos(std::vector<Furniture> &  fVec, Image<Color>& texture){
  // Genereate Random Position
  std::cout << "Randomizing"<< std::endl;

  MTRand mtrand;
  unsigned int curIndex = 0;

  // for each piece of furnature
  while(curIndex < fVec.size()){
    std::cout << "Desk "<< curIndex<<" Tying" << std::endl;

    // random x and y and rotation
    float start_x = mtrand.rand(TEXTURE_SIZE_X);
    float start_y = mtrand.rand(TEXTURE_SIZE_Y);
    double start_rot = mtrand.rand(2* M_PI);

    // set to that random values
    fVec[curIndex].setPos(start_x, start_y);
    fVec[curIndex].setAngle(start_rot);

    // check if were good
    if(insideSpace(fVec[curIndex], texture)){
      
      //debug
      Color avgColor  = getApproxColor(fVec[curIndex] , texture);
      std::cout << "Desk "<< curIndex<<" PASS ";
      std::cout << static_cast<unsigned>(avgColor.r)<< ", ";
      std::cout << static_cast<unsigned>(avgColor.g)<< ", ";
      std::cout << static_cast<unsigned>(avgColor.b)<< std::endl;
      curIndex++;

    }else{
      std::cout << "Desk "<< curIndex<<" FAIL"<< std::endl;
    }
  }
}

void deskMove(Furniture& item,double heat, Image<Color>& texture){
  // Moves and saved to item, so long as it is inside

  // Using 
  MTRand mtrand;
  int TIRES = 100;

  while(0 < TIRES){

    double move_x = mtrand.rand(2*heat);
    double move_y = mtrand.rand(2*heat);

    //dummy item
    Furniture dummy(-1, "dummy", 
        item.getAngle(), 
        item.getPos().x , 
        item.getPos().y);

    // we want to be able to fitter forward and backwards
    dummy.setPos(
        dummy.getPos().x - heat,
        dummy.getPos().y - heat);

    // jitter it
    dummy.setPos(
        dummy.getPos().x + move_x,
        dummy.getPos().y + move_y);
    
    if(insideSpace(dummy,texture) ){
      // if we didn't fall off save
      item.setPos(
         dummy.getPos().x,
         dummy.getPos().y);
      break;
    }else{
      //dec
      TIRES--;
    }

  }//while

}//deskMove
void saveFurnitureState(std::ofstream & out_str, std::vector<Furniture> & fVec, int & itemCount){

  // number of objects
  out_str << "num_obj " << fVec.size() << std::endl;

  for(int i = 0; i < fVec.size(); i++){
  
    //print out type
    out_str << fVec[i].getType() << std::endl;

    // print out pos line
    out_str << "pos " << fVec[i].getPos().x << " " <<fVec[i].getPos().y << std::endl;

    // print out angle
    out_str << "rot " << fVec[i].getAngle() * (180/M_PI) << std::endl;
  }
  
  out_str << "end" << std::endl;
  
}

bool inRange(float x, float y){
  return (0 <= x && x<= TEXTURE_SIZE_X) && ( 0 <= y && y<= TEXTURE_SIZE_Y);
}

Color getApproxColor(Furniture& item, Image<Color>& texture){

  //Calcuate Bounding Box and Rotate According to Angle (Radians)
  float x_c = item.getPos().x;
  float y_c = item.getPos().y;

  int max_x, max_y, min_x, min_y, totalPixels;

  max_x = (int) (x_c + DESK_LENGTH/2.0);
  min_x = (int) (x_c - DESK_WIDTH/2.0);
  
  max_y = (int) (y_c + DESK_LENGTH/2.0);
  min_y = (int) (y_c - DESK_WIDTH/2.0);

  // Make a black pixel that I will add to
  Color colorSum(0,0,0);


  // Check if we are inrange of our texture image
  if(!(inRange(max_x,max_y) && inRange(min_x, min_y))){
     return colorSum;
  }

  // colors
  unsigned int red = 0;
  unsigned int gre = 0;
  unsigned int blu = 0;

  // Pixels 
  totalPixels = 0;
  // for all pixles in that square range add to colorSum
  for(int x = min_x; x < max_x; x++){
    for(int y = min_y; y < max_y; y++){
      Color curPixel = texture.GetPixel(x,y);
      red += (int)curPixel.r;
      gre += (int)curPixel.b;
      blu += (int)curPixel.g;
      totalPixels++;
    }
  }//for

  // Find the average color
  red = ((double)red) / totalPixels;
  gre = ((double)gre) / totalPixels;
  blu = ((double)blu) / totalPixels;

  colorSum.r = (unsigned char)red;
  colorSum.g = (unsigned char)gre;
  colorSum.b = (unsigned char)blu;

  return colorSum;
}

bool insideSpace(Furniture& item, Image<Color>& texture){
  // Need to search inside the image for an approximate size
  // Hack: We will approximate desk length and width

  float x_c = item.getPos().x;
  float y_c = item.getPos().y;

  int max_x, max_y, min_x, min_y;

  max_x = (int) (x_c + DESK_LENGTH/2.0);
  min_x = (int) (x_c - DESK_WIDTH/2.0);
  
  max_y = (int) (y_c + DESK_LENGTH/2.0);
  min_y = (int) (y_c - DESK_WIDTH/2.0);

  // Make a black pixel that I will add to
  int totalBadPixels = 0;

  // Check if we are inrange of our texture image
  if(!(inRange(max_x,max_y) && inRange(min_x, min_y))){
     return false;
  }

  // for all pixles in that square range add to colorSum
  for(int x = min_x; x < max_x; x++){
    for(int y = min_y; y < max_y; y++){
      Color curPixel = texture.GetPixel(x,y);
      if(curPixel.isBlack())
        totalBadPixels++;
    }
  }//for

  // If we have too many black pixels
  //std::cout << "TEST FOUND BLACK:"<< 100*totalBadPixels/(double)(DESK_WIDTH*DESK_LENGTH)<<"%"<<std::endl;
  return totalBadPixels == 0;
}

void loadFurnitureState(std::ifstream & in_str, 
    std::vector<Furniture> & fVec, int & itemCount){

  // function will load in furniture into the fVec
  std::string command;

  while(in_str >> command){
    
    if(command == "num_obj"){
      // total numbers of items we will use
      in_str >> itemCount;
    
    }else if(command == "desk"){
      // make default item, and push into vector
      Furniture item;
      // set item number
      item.setID(fVec.size());
      item.setType(command);

      // push
      fVec.push_back(item);
    
    }else if(command == "pos"){
      // get pos
      float x,y;
      in_str >> x >> y;
      fVec.back().setPos(x,y);
    
    }else if(command == "rot"){

      double rad;
      in_str >> rad;
      // conver to radians
      rad = rad * (M_PI / 180);
      fVec.back().setAngle(rad);
    
    }else if(command == "end"){
      // We are done reading in the inputs 
      return;
    }
  }//while
}//load
