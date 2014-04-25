window.onload    = function () {
    //CONST
    var onLeftSide = true;
    var WIDTH_CANVAS = 1535;
    var HEIGHT_CANVAS = 810;
    var WALL_NUM = 10;
    var WIN_NUM = 10;

    //Global Var -- I'm sorry CS1100 stduents :( 
    var shapeTabOpen = false;
    var draggingShape = false;

    //GETTING SCREEN DIMENSIONS
    var height = $(this).height();       
    var width = $(this).width(); 

    function xScale(x){return x*(width/WIDTH_CANVAS)};
    function yScale(y){return y*(height/HEIGHT_CANVAS)};



    /* DEFINE WHERE TO PUT USER INTERFACE 
     * (Rebecca if you want move UI change these)*/
    if(onLeftSide)
    {
        var width = (width/2);                  //Get  half of the screen
        var height = height;                     //Get entire half
        var canvas_x = 0;                       //Where to start x coordinate
        var canvas_y = 0;                       //Where to start y coorindate
    }else{
        
        var width = (width/2);
        var height = height;
        var canvas_x = width;
        var canvas_y = 0;


    }



    //UI Canvas
    var paper = Raphael(canvas_x, canvas_y, width, height);


  

    //Drawing Table
    var cx = width/2;
    var cy = height/2;
    var radius = width/2  - width/8 - xScale(10);
    var table = paper.circle(cx,cy,radius).attr(
            {fill: "white", stroke: "none", opacity: .5});

    //Moving table to right, to make space for permenent shapetab
    var x0 = width/4;
    var x1 = width;
    var xCenter = (x0 + x1)/2;
    table.attr({cx: xCenter});
   
    //Setting up shape tab
    var ftShapeTab = paper.freeTransform(
            paper.rect(0,0,width/4,height,10).
            attr({fill: 'black', opacity: .5}),
            {scale:false,drag:false});
    ftShapeTab.apply();
    ftShapeTab.hideHandles();
 
    
    //close tab method
    function closeShapeTab(){

        shapeTabOpen = false;
        console.log("close shape tab");
        ftShapeTab.hideHandles();
        
    }


    // Array I'm keeping my walls and windows, using index to get orginal objects
    var ftWallArray = new Array();
    var ftWindowArray = new Array();

    //CREATING OBJECTS
    var ftWallArray = initalize_walls(WALL_NUM);
    var ftWindowArray = initalize_windows(WIN_NUM);


    //North Arrow text with updates top screen
    var north_text = paper.text(100,100,"Set north\nDirection");
    var ftNorth = paper.freeTransform(
            paper.path('M24.086,20.904c-1.805,3.113-5.163,5.212-9.023,5.219c-5.766-0.01-10.427-4.672-10.438-10.435C4.636,9.922,9.297,5.261,15.063,5.25c3.859,0.007,7.216,2.105,9.022,5.218l3.962,2.284l0.143,0.082C26.879,6.784,21.504,2.25,15.063,2.248C7.64,2.25,1.625,8.265,1.624,15.688c0.002,7.42,6.017,13.435,13.439,13.437c6.442-0.002,11.819-4.538,13.127-10.589l-0.141,0.081L24.086,20.904zM28.4,15.688l-7.15-4.129v2.297H10.275v3.661H21.25v2.297L28.4,15.688z').attr({fill: "white", stroke: "none", opacity: .8}),
            {drag:false, scale:false},
            function(ft,events){
                if(events == "rotate"){
                    north_text.attr({text: String(toRadians(Math.floor(ftNorth.attrs.rotate)))});
                }
            });


    //Setting up Submit Button
    var submitButton = paper.rect(0,0,ftShapeTab.attrs.size.x *.8, yScale(30),2);
        submitButton.attr({
            x:ftShapeTab.attrs.size.x/2 - submitButton.attr('width')/2,
            y:yScale(30),
            fill: 'grey',
            stroke: 'black',
            'stroke-width': 3,
            opacity:0
        });
    submit_text = paper.text(submitButton.attr('x')+ submitButton.attr('width')/2, submitButton.attr('y') + submitButton.attr('height')/2, "Generate Wall File");
    submit_text.attr({fill:'white', opacity:0});
    //Setting up location/scale of north arrow
    ftNorth.attrs.translate.x += ftShapeTab.attrs.size.x/2 - ftNorth.attrs.size.x/2;
    ftNorth.attrs.translate.y += height - yScale(100);
    ftNorth.attrs.scale.x *= 2;
    ftNorth.attrs.scale.y *= 2;
    north_text.attr({
        x: ftNorth.attrs.translate.x + ftNorth.attrs.size.x/2,
        y: ftNorth.attrs.translate.y + 2 *  ftNorth.attrs.size.y,
        fill: 'white'});

    //submit event handler to save file
    submitButton.click(function(){
        
        saveTextAsFile();
    });


    //Hiding north arrow
    ftNorth.subject.attr({opacity: 0});
    ftNorth.hideHandles();
    north_text.attr({opacity:0});
    ftNorth.apply();
    
    //File Saving Magic
    function printData(ftWallArray,ftNorth){
        var log = "";
        log += "north " + toStr(toRadians(ftNorth.attrs.rotate)) + "\n";
        log += "floor_material   1.000 1.000 1.000\n";
        log += "ceiling_material 1.000 1.000 1.000\n";
        log += "wall_material  1.000 1.000 1.000\n";
        log += "table 0.000000 0.000000 0.000000 0.537077\n";

        var logWall = "";
    
        for (var i= 0; i < ftWallArray.length; i++) {
        
            var wall = ftWallArray[i],
            x = wall.attrs.x + wall.attrs.translate.x,
            y = wall.attrs.y + wall.attrs.translate.y,
            w = wall.attrs.size.x,
            h = wall.attrs.size.y,
            a = wall.attrs.rotate;

            var uL = upperLeftCorner(x,y,w,h,a);
            var uR = upperRightCorner(x,y,w,h,a);
            var lR = lowerRightCorner(x,y,w,h,a);
            var lL = lowerLeftCorner(x,y,w,h,a);

            if(isWallValid(uL,uR,lR,lL) && wall.subject.attr('opacity') > 0){

                uL = centerPoint(uL);
                uR = centerPoint(uR);
                lR = centerPoint(lR);
                lL = centerPoint(lL);
                
                console.log(uL[0] + " " + uL[1]);
                logWall += "wall    ";
                logWall += toStr(uL[0]) + "  " + toStr(uL[1]) + "  ";
                logWall += toStr(uR[0]) + "  " + toStr(uR[1]) + "  ";
                logWall += toStr(lR[0]) + "  " + toStr(lR[1]) + "  ";
                logWall += toStr(lL[0]) + "  " + toStr(lL[1]) + "  ";
                logWall += toStr(getHeight(8)) + "\n";

                if(wall.idPair != null){
                 
                    var wall = ftWinArray[wall.idPair],
                    x = wall.attrs.x + wall.attrs.translate.x,
                    y = wall.attrs.y + wall.attrs.translate.y,
                    w = wall.attrs.size.x,
                    h = wall.attrs.size.y,
                    a = wall.attrs.rotate;

                    var uL = upperLeftCorner(x,y,w,h,a);
                    var uR = upperRightCorner(x,y,w,h,a);
                    var lR = lowerRightCorner(x,y,w,h,a);
                    var lL = lowerLeftCorner(x,y,w,h,a);

                    uL = centerPoint(uL);
                    uR = centerPoint(uR);
                    lR = centerPoint(lR);
                    lL = centerPoint(lL);
                    
                    console.log(uL[0] + " " + uL[1]);
                    logWall += "window  ";
                    logWall += toStr(uL[0]) + "  " + toStr(uL[1]) + "  ";
                    logWall += toStr(uR[0]) + "  " + toStr(uR[1]) + "  ";
                    logWall += toStr(lR[0]) + "  " + toStr(lR[1]) + "  ";
                    logWall += toStr(lL[0]) + "  " + toStr(lL[1]) + "  ";
                    logWall += "cyan\n";

                }
            }
        }
    log += logWall;
    return log;
    }

    function centerPoint(point){
        TABLE = 1.0668; //42 inches
        
        scale = TABLE/(table.attr('r')*2);
        centeredPoint = Array();        
        x = point[0];
        y = point[1];
        cx = table.attr('cx');
        cy = table.attr('cy');
        
        
        centeredPoint[0] = Math.round(10000*(cx - x)*scale)/10000;
        centeredPoint[1] = Math.round(10000*(cy - y)*scale)/10000;
        return centeredPoint;
    } 
    
    function isWallValid(uL,uR,lR,lL){ 
        return onTable(uL[0],uL[1]) && 
               onTable(uR[0],uR[1]) && 
               onTable(lR[0],lR[1]) && 
               onTable(lL[0],lL[1]); 
    }

    function toStr(num){ 
        if (num > 0){
            return "+" + num; 
        }else{
            return num;
        }
    }

    function onTable(x,y){
        cx = table.attr('cx');
        cy = table.attr('cy');
        rad = table.attr('r');
        distance = Math.sqrt(Math.pow(cx-x,2) + Math.pow(cy-y,2));
        return distance < rad;
    }
    function saveTextAsFile(){
        var textToWrite = printData(ftWallArray,ftNorth);
        var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
        var fileNameToSaveAs = "testWallFile.wall";

    	var downloadLink = document.createElement("a");
    	downloadLink.download = fileNameToSaveAs;
    	downloadLink.innerHTML = "Download File";
    	if (window.webkitURL != null){

    		// Chrome allows the link to be clicked
    		// without actually adding it to the DOM.
    		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    	
        }else{

    		// Firefox requires the link to be added to the DOM
    		// before it can be clicked.
    		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    		downloadLink.onclick = destroyClickedElement;
    		downloadLink.style.display = "none";
    		document.body.appendChild(downloadLink);
    	}
    	
        downloadLink.click();
    	
    }

    function destoryClickedElement(event){
        document.body.removeChild(event.target);
    }
	
    //Converts toRadians for user
    function toRadians (angle) {
        if(angle  < 0){
            angle = Math.abs(angle);
        }else if(angle>0){
            angle = 180 - angle;
            angle +=180;
        }
          
        angle =  angle * (Math.PI / 180);
        return Number((angle).toFixed(2))
    }

    //Converts to regular usage of angle
    function toCompass(angle){
       return -1*angle;
    } 


    //WALL HANDLER FUNCTIONS
    function wall_drag_start(ftWall){draggingShape = true;}

    
    function wall_drag_end(ftWall){
        if(shapeTabOpen){
            closeShapeTab();
            draggingShape = false;
        }
        ftWall.showHandles();
    }
   
    
    function wall_drag_move(ftWall){
        
        // if Wall is a part of pair, move that window
        if(ftWall.idPair != null){

            ftWin = ftWindowArray[ftWall.idPair];

            //TODO Implement multiwalls
            //          *requires storing idPairs as list with offset
            //              *idPair = {idPair, offSet}

            //Center of wall
            x_center = ftWall.attrs.translate.x + ftWall.attrs.size.x/2;
            y_center = ftWall.attrs.translate.y + ftWall.attrs.size.y/2;

            //Set window to center of the wall
            ftWin.attrs.translate.x = x_center - (ftWin.attrs.x - ftWall.attrs.x) - ftWin.attrs.size.x/2;
            ftWin.attrs.translate.y = y_center - (ftWin.attrs.y - ftWall.attrs.y) - ftWin.attrs.size.y/2;

            // Rotating and disabling
            ftWin.apply();
 
        }
    }

    function wall_rotate(ftWall){
        if(ftWall.idPair != null){

            ftWin = ftWindowArray[ftWall.idPair];
            // Rotating and disabling
            ftWin.attrs.rotate = ftWall.attrs.rotate;
            ftWin.apply();
        }
    }
    
    
    //WINDOW HANDLER FUNCTIONS
    function win_drag_start(ftWin){draggingShape = true;}

    function win_rotate(ftWin){}
    
    function win_drag_move(ftWin){

        console.log("dragging win " + ftWin.idNumber);

        // center of window
        var win_x = ftWin.attrs.translate.x +  ftWin.attrs.x +(ftWin.attrs.size.x/2); 
        var win_y = ftWin.attrs.translate.y + ftWin.attrs.y  +(ftWin.attrs.size.y/2);

        // getting nearest wall
        var ftWall = wallNear(win_x,win_y);

        // rotate to nearest wall
        if(ftWall != null){
            
            ftWin.attrs.rotate = ftWall.attrs.rotate;
            ftWin.apply();
        }
    }
    
    function win_drag_end(ftWin){
        console.log("Ending win dragging");

        var win_x = ftWin.attrs.translate.x +  ftWin.attrs.x +(ftWin.attrs.size.x/2); 
        var win_y = ftWin.attrs.translate.y + ftWin.attrs.y  +(ftWin.attrs.size.y/2);

        // getting nearest wall
        var ftWall = wallNear(win_x,win_y);

        if(ftWall != null){

            // Pair them up!
            ftWall.idPair = ftWin.idNumber;
            ftWin.idPair = ftWall.idNumber;
            
            //Center of wall
            x_center = ftWall.attrs.translate.x + ftWall.attrs.size.x/2;
            y_center = ftWall.attrs.translate.y + ftWall.attrs.size.y/2;

            //Set window to center of the wall
            ftWin.attrs.translate.x = x_center - (ftWin.attrs.x - ftWall.attrs.x) - ftWin.attrs.size.x/2;
            ftWin.attrs.translate.y = y_center - (ftWin.attrs.y - ftWall.attrs.y) - ftWin.attrs.size.y/2;

            
            // Rotating and disabling
            ftWin.showHandles();
            
            var minSizeWin = ftWin.attrs.size.x;
            var maxSizeWin = ftWall.attrs.size.x*.9;
            ftWin.subject.attr({opacity: 1});
            ftWin.apply();
            ftWin.setOpts({range: { scale: [-999999,maxSizeWin] }});

 
        //Join them!
        }else{
            
            // Dragged off a wall
            if(ftWin.idPair != null){
                // Remove pair from wall
                ftWall = ftWallArray[ftWin.idPair];
                ftWall.idPair = null;

                // Remove pair from window
                ftWin.idPair = null;
                ftWin.attrs.scale.x = 1;
                ftWin.setOpts({range: { scale: [-99999,99999] }});
                ftWin.hideHandles({undrag:false});
                ftWin.subject.attr({opacity: .5});
            }

            // Snap back to oringal location
            ftWin.attrs.translate.x = 0;
            ftWin.attrs.translate.y = 0;
            ftWin.attrs.rotate = 0;
            ftWin.subject.attr({opacity: 0});
            ftWin.apply();

        }

    
        if(shapeTabOpen){
            closeShapeTab();
            draggingShape = false;
        }
    }

    //FREE TRANSFORM INIT FUNCTIONS
    function initalize_walls(WALL_NUM){
        
        //Array storing Walls in
        ftWallArray = new Array();
        
        // Make WALL_NUM walls
        for(var i = 0; i < WALL_NUM; i++){
            
     
            var ftWall = paper.freeTransform(
                wall = paper.rect(
                    ftShapeTab.attrs.size.x/2 - inches2pixles(8)/2,
                    ftShapeTab.attrs.size.y/2 - yScale(50),
                    inches2pixles(8),
                    inches2pixles(.25)).attr({
                        fill:"white",
                        opacity:0,
                        stroke: 'white',
                        'stroke-width':5
                        })
                ,{scale:['axisX'] },
                function(ftWall,events){

                    if(events == "drag start"){
                        wall_drag_start(ftWall);
                    }else if(events == "drag end"){
                        wall_drag_end(ftWall);
                    }else if(events == "rotate"){
                        wall_rotate(ftWall);
                    }else{
                        wall_drag_move(ftWall);
                    }
                });
            
            //Addtional fields for each wall object
            ftWall.idNumber = i;
            ftWall.idPair = null;

            //Hiding handlebars, will appear after moved
            ftWall.hideHandles({undrag:false});

            //Adding to Array
            ftWallArray[i] = ftWall;

        }//for
       
        // Return  the array of walls
        return ftWallArray;

    }//init_walls

    function initalize_windows(WIN_NUM){
         
        //Array storing Walls in
        ftWinArray = new Array();
        
        // Make WALL_NUM walls
        for(var i = 0; i < WIN_NUM; i++){
            
      
            var ftWin = paper.freeTransform(
                win = paper.rect(
                    ftShapeTab.attrs.size.x/2 - inches2pixles(2)/2,
                    ftShapeTab.attrs.size.y/2 - yScale(100),
                    inches2pixles(2),
                    inches2pixles(.25))
                .attr({fill:"blue", opacity:0,stroke:'blue','stroke-width':5})
                ,{scale: ['axisX'], rotate:false},
                
                function(ftWin,events){

                    if(events == "drag start"){
                        win_drag_start(ftWin);
                    }else if(events == "apply"){
                        win_drag_move(ftWin);
                    }else if(events == "drag end"){
                        win_drag_end(ftWin);
                    }else if(events == "rotate"){
                        win_rotate(ftWin);
                    }
                });

            //Addtional fields for each wall object
            ftWin.idNumber = i;
            ftWin.idPair = null;

            //ftWin.attrs.translate.y += yScale(200);
            //Hiding handlebars on windows
            ftWin.hideHandles({undrag:false});
            ftWin.apply();

            //Adding to Array
            ftWinArray[i] = ftWin;


        }//for
       
        // Return  the array of walls
        return ftWinArray;
    
    }//init_win

    function wallNear(x,y){
        //This function assusmes that x,y are center point of a window, and calculates
        //the nearest wall object in ftWallArray, using a given range.
        
        // Picking random wall as nearest
        var ftNearWall =  0;
        var ftNearDist = 1000;
        // Update if I find a closer wall
        for(var i = 0; i < ftWallArray.length; i++){
            
           var wall_x = ftWallArray[i].attrs.translate.x + ftWallArray[i].attrs.x +(ftWallArray[i].attrs.size.x/2);
           var wall_y = ftWallArray[i].attrs.translate.y + ftWallArray[i].attrs.y +(ftWallArray[i].attrs.size.y/2);
            
           // Distance formula
           var dist_x = x - wall_x;
           dist_x *= dist_x;
           var dist_y = y - wall_y;
           dist_y *= dist_y;
           var dist = Math.sqrt(dist_x+dist_y);
          
           // found closer
           if (ftNearDist >= dist){
               ftNearDist = dist;
               ftNearWall = i;
           } 

        }//for

        // Give it a range of where you can snap 
        var range = ftWallArray[ftNearWall].attrs.size.x / 2;
        
        if(ftNearDist <= range && ftNearDist != 1000){
            
            // win is close to snap
            return ftWallArray[ftNearWall];
            
        }else{
            // win is too far away from wall
            return null;
        }
    }//wallNear
    
    // Functions to find coordinates of rectangle

    // FUNCTIONS TO FIND THE COORDINATES OF RECTANGLE
    function upperRightCorner(x,y,w,h,angle){
        var coor = new Array();
        
        angle = toRadians(angle);
        var angle_off = Math.tan(h/w);
        var distance = (Math.sqrt(Math.pow(w,2) +Math.pow(h,2)))/2;
        var angle_rel = angle + angle_off;
        var relPoint = toRect(distance,angle_rel);
       
        var cx = x + (w/2);
        var cy = y + (h/2);
        
        coor[0] = cx + relPoint[0];
        coor[1] = cy + relPoint[1];
        
        return coor;
    }
     function lowerRightCorner(x,y,w,h,angle){
        var coor = new Array();
        
        angle = toRadians(angle);
        var angle_off = Math.tan(-h/w);
        var distance = (Math.sqrt(Math.pow(w,2) +Math.pow(h,2)))/2;
        var angle_rel = angle + angle_off;
        var relPoint = toRect(distance,angle_rel);
       
        var cx = x + (w/2);
        var cy = y + (h/2);
        
        coor[0] = cx + relPoint[0];
        coor[1] = cy + relPoint[1];
        
        return coor;
    }

    function upperLeftCorner(x,y,w,h,angle){
        var coor = new Array();
        
        angle = toRadians(angle);
        var angle_off = Math.tan(-h/w);
        var distance = (Math.sqrt(Math.pow(w,2) +Math.pow(h,2)))/2;
        var angle_rel = angle + angle_off;
        var relPoint = toRect(distance,angle_rel);
       
        var cx = x + (w/2);
        var cy = y + (h/2);
        
        coor[0] = cx - relPoint[0];
        coor[1] = cy - relPoint[1];
        
        return coor;
    }
    
    function lowerLeftCorner(x,y,w,h,angle){
        var coor = new Array();
        
        angle = toRadians(angle);
        var angle_off = Math.tan(h/w);
        var distance = (Math.sqrt(Math.pow(w,2) +Math.pow(h,2)))/2;
        var angle_rel = angle + angle_off;
        var relPoint = toRect(distance,angle_rel);
       
        var cx = x + (w/2);
        var cy = y + (h/2);
        
        coor[0] = cx - relPoint[0];
        coor[1] = cy - relPoint[1];
        
        return coor;
    }
    
    function toRect(dist,angle){
        var point = new Array();
        point[0] = dist * Math.cos(angle);
        point[1] = dist * Math.sin(angle)*-1;
        return point;
    }
 
    //open tab method
    function openShapeTab(){
        shapeTabOpen = true;
         
        console.log("open shape tab");
        ftShapeTab.hideHandles();

        for(var i = 0; i < ftWallArray.length; i++){
            var ftWall = ftWallArray[i];
            if(ftWall.attrs.translate.x == 0 && ftWall.attrs.translate.y == 0)
                ftWall.subject.animate({opacity: 1},1000, "<");
        }
 
        for(var i = 0; i < ftWinArray.length; i++){
            var ftWin = ftWinArray[i];
            if(ftWin.attrs.translate.x == 0 && ftWin.attrs.translate.y == 0)
                ftWin.subject.animate({opacity: .5},1000, "<");
        }

        //showing north arrow
        ftNorth.subject.animate({opacity: 1}, 1000, "<");
        north_text.animate({opacity:1},1000,"<");
        ftNorth.showHandles();
        ftNorth.apply();
        
        //showing submit button
        submitButton.animate({opacity:1}, 1000, "<");
        submit_text.animate({opacity:1}, 1000, "<");
        //Move bar
        ftShapeTab.apply();
    }

    //Opening shapetab if hovered over it
    ftShapeTab.subject.mouseover(function(){
        if(!shapeTabOpen){
            openShapeTab();
        }
    });


    //Closing shapetab if hovered out of it
    table.mouseover(function(){
        if(shapeTabOpen && !draggingShape){
            closeShapeTab();
        }
    });

    //Scaling functions
    function inches2pixles(inches){
        TABLE = 42// inches
        scale = (table.attr('r')*2)/TABLE;
        return inches*scale;
    }

    //Converting measures
    function inch2meter(num){return num/39.3701;}
    function meter2inches(num){ return num*39.3701;} 

    function getHeight(num){
       return Math.round(10000*inch2meter(num))/10000; 
    }
    
    //HAX to open tab
    openShapeTab();

}
