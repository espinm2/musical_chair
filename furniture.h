#include <glm/glm.hpp>
#include <iostream>
#include <vector>
#include <string>
#include <math.h>
#include "image.h"


// ===================================================================================================
// ===================================================================================================
void rotatePoint(const glm::vec2 &  center, glm::vec2 &  point, const double angle){

  // Rotate point around and axis of the center, alters point
  double s = sin(angle);
  double c = cos(angle);

  // tranlsate back to orgin
  point.x -= center.x;
  point.y -= center.y;

  //rotate
  double  xnew =   point.x * c - point.y * s;
  double  ynew =   point.x * s + point.y * c;

  point.x = xnew + center.x;
  point.y = ynew + center.y;

}

// ===================================================================================================
// ===================================================================================================
class Furniture {
  public:
    Furniture(int id, std::string type, int angle, float  x, float  y){
      _id = id;
      _type = type;
      _angle = angle;
      _pos = glm::vec2(x,y);
    }
    
    Furniture(){
      _id = -1;
      _type = "none";
      _angle = 0;
      _pos = glm::vec2(-1,-1);
    }

    // Getter functions
    int  getID() const { return _id; }
    std::string  getType() const { return _type; }
    double getAngle() const { return _angle; }
    glm::vec2 getPos() const { return _pos; }

    std::vector<glm::vec2> getBackEdge(){
      std::vector<glm::vec2> back;
      back.push_back(_bbox[1]);
      back.push_back(_bbox[2]);
      return back;
    }

    // Setter functions
    void setID(int num){ _id = num; }
    void setType(std::string& t){ _type = t;}
    void setAngle(double a) { _angle = a;}
    void setPos(float x, float y){
      _pos = glm::vec2(x,y);
    }

    double getWallAngle(Image<Color> texture){
      // DO NOT USE
      // DO NOT USE
      // DO NOT USE
      // Get the parametric equation of item's back face;
      glm::vec2 rayBegin = _bbox[1] + _bbox[2];
      rayBegin.x = rayBegin.x / 2;
      rayBegin.y = rayBegin.y / 2;

      // Get slope 
      double slope = (_bbox[1].y - _bbox[0].y) / (_bbox[1].x - _bbox[0].x);

      bool hitBlackPixel = false;
      const double INCR = .01;
      double t = rayBegin.x;
      int x;
      int y;

        // Keep tring to find a black pixel in the scene at specific direction
      while(hitBlackPixel){
        x = (int)t;
        y = (int) slope * (t - rayBegin.x) + rayBegin.y;


        // if in range of pixture
        bool x_in_range = (0<=x)&&(x<512);
        bool y_in_range = (0<=y)&&(y<512);

        if(!(x_in_range && y_in_range))
          break;
        
        // if in range get a pixel
        Color pix = texture.GetPixel(x,y);
        
        // if it is black
        if(pix.isBlack()){
          hitBlackPixel = true;
          break;
        }else{
          // keep looking
          t += INCR;
        }

      }//while

      // If I failed, return something obviously wrong;
      if(hitBlackPixel){
      
        Color avgColor = texture.GetPixel(x,y);
        std::cout << static_cast<unsigned>(avgColor.r)<< ", ";
        std::cout << static_cast<unsigned>(avgColor.g)<< ", ";
        std::cout << static_cast<unsigned>(avgColor.b)<< std::endl;

        return 0;
      }else{
        return -999;

      }
    }

    void calculateBBox(double length, double width){

      // Finding regular bounding box
      glm::vec2 upperLeft (_pos.x -(width/2.0), _pos.y - (length/2.0));
      glm::vec2 upperRight(_pos.x +(width/2.0), _pos.y - (length/2.0));
      glm::vec2 lowerRight(_pos.x +(width/2.0), _pos.y + (length/2.0));
      glm::vec2 lowerLeft (_pos.x -(width/2.0), _pos.y + (length/2.0));

      //Rotating depending on angle
      rotatePoint(_pos, upperLeft, _angle);
      rotatePoint(_pos, upperRight, _angle);
      rotatePoint(_pos, lowerRight, _angle);
      rotatePoint(_pos, lowerLeft, _angle);

      // Setting bbox
      _bbox[0] = upperLeft;
      _bbox[1] = upperRight;
      _bbox[2] = lowerRight;
      _bbox[3] = lowerLeft;


    }

    // utils
    void print(){
      std::cout << "item of type " << _type << " with  pos: (" << _pos.x << "," << _pos.y << ") with radian: " << _angle << std::endl; 
    }

    
  private:
    int _id;
    std::string _type;
    double _angle;
    glm::vec2 _pos;
    glm::vec2 _bbox[4];

};







