window.onload    = function () {

 
    /*********************************************************************
    *
    * Global Varivles
    *
    **********************************************************************/

    // Constants
    var WIDTH_CANVAS = 1535;
    var HEIGHT_CANVAS = 810;
    var WALL_NUM = 30;
    var WIN_NUM = 10;

    // Status Varibles
    var draggingShape = false;

    // Array I'm keeping my walls and windows, using index to get orginal objects
    var ftWallArray = new Array();
    var ftWindowArray = new Array();


    // Global sizes
    var height = window.innerHeight;
    var width = $(this).width(); 

    // Functions for scaling
    function xScale(x){return x*(width/WIDTH_CANVAS)};
    function yScale(y){return y*(height/HEIGHT_CANVAS)};

    /*********************************************************************
    *
    * Creations of ftShapeTab + Tabletop
    *
    **********************************************************************/

    // DEFINE WHERE TO PUT USER INTERFACE 
    var width = (width/2);                  //Get  half of the screen
    var height = height;                     //Get entire half
    var canvas_x = 0;                       //Where to start x coordinate
    var canvas_y = 0;                       //Where to start y coorindate

    //UI Canvas (Max)
    var left_paper = Raphael(canvas_x, canvas_y, width, height);

    //UI Canvas (Rebbecca)
    var right_paper = Raphael(width, 0, width, height);

    //Drawing Tab (Max's Side)
    var barXpos = 0;
    var barYpos = 8.5*height/10;
    var barWidth = width;
    var barHeight = 1.5*height/10;

    // Creating the bottom bar for both sides of the screen
    var left_bar = left_paper.rect(barXpos, barYpos, barWidth, barHeight).attr({fill:"black", opacity: .3});
    var right_bar = right_paper.rect(barXpos, barYpos, barWidth, barHeight).attr({fill:"black", opacity: .3});
 
    //Drawing BackTableTop
    var cx = width/2;
    var cy = height/2 - height/10.0;
    var radius = width/2  - width/8 - xScale(10);
    left_paper.rect(cx-radius,cy-radius,radius*2,radius*2).attr({fill:"black",opacity: .1});

    //Drawing Tabletop
    var table = left_paper.circle(cx,cy,radius).attr(
            {fill: "white", stroke: "white", opacity: .5});
    

    // Creation of the ShapeTab
    var ftShapeTab = left_paper.freeTransform(left_bar, {drag:false, scale:false});
    ftShapeTab.hideHandles(); 

 
    /*********************************************************************
    *
    * Creating Walls
    *
    **********************************************************************/
   
    // Initializing the wall
    var ftWallArray = initalize_walls(WIN_NUM);
    var ftWindowArray = initalize_windows(WIN_NUM);

    /*********************************************************************
    *
    * Creating Lables in UI
    *
    **********************************************************************/

    // Walls Label
    left_paper.text(
        1.25*(ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x,
        4*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y ,
        "WALLS").
      attr({
        "text-anchor": "start",
        "font-size": 20
      });
    
    // Window Label
     left_paper.text(
        3.5*(ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x,
        4*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y ,
        "WINDOWS").
      attr({
        "text-anchor": "middle",
        "font-size": 20
      });

    // North Arrow Label
    var north_text = left_paper.text(
        6*(ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x,
        4*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y ,
        "NORTH").
      attr({
        "text-anchor": "middle",
        "font-size": 20
      });

    // Save
    left_paper.text(
        8*(ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x,
        4*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y ,
        "SAVE").
      attr({
        "text-anchor": "start",
        "font-size": 20
      });
    left_paper.text(
        4.5*(ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x,
        4*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y ,
        "POV").
      attr({
        "text-anchor": "start",
        "font-size": 20
      });


    /*********************************************************************
    *
    * Scaling Functions
    *
    * + inches2pixles
    *
    **********************************************************************/
   
  
    //Scaling functions
    function inches2pixles(inches){
        TABLE = 42// inches
        scale = (table.attr('r')*2)/TABLE;
        return inches*scale;
    }
  
    /*********************************************************************
    *
    * Submit Button
    *
    *
    **********************************************************************/

    var submitIcon = left_paper.freeTransform(
        left_paper.path("M29.548,3.043c-1.081-0.859-2.651-0.679-3.513,0.401L16,16.066l-3.508-4.414c-0.859-1.081-2.431-1.26-3.513-0.401c-1.081,0.859-1.261,2.432-0.401,3.513l5.465,6.875c0.474,0.598,1.195,0.944,1.957,0.944c0.762,0,1.482-0.349,1.957-0.944L29.949,6.556C30.809,5.475,30.629,3.902,29.548,3.043zM24.5,24.5h-17v-17h12.756l2.385-3H6C5.171,4.5,4.5,5.171,4.5,6v20c0,0.828,0.671,1.5,1.5,1.5h20c0.828,0,1.5-0.672,1.5-1.5V12.851l-3,3.773V24.5z")
        .attr({fill: "white", stroke: "none"}), {drag:false, scale:false});
    submitIcon.attrs.scale.x = 3.75;
    submitIcon.attrs.scale.y = 3.75;
    submitIcon.attrs.translate.x += 8*ftShapeTab.attrs.size.x/10 + ftShapeTab.attrs.x;
    submitIcon.attrs.translate.y += 1.5*ftShapeTab.attrs.size.y/5 + ftShapeTab.attrs.y;
    submitIcon.hideHandles();
    submitIcon.apply();
 
    var submitButton = left_paper.circle(
        submitIcon.attrs.translate.x + submitIcon.attrs.center.x, 
        submitIcon.attrs.translate.y + submitIcon.attrs.center.y, 
        submitIcon.attrs.size.x*3);
    submitButton.attr({fill:"white", opacity:0});

    submitButton.mouseover(function(){
      submitIcon.subject.attr({fill:"green"});
    });

    submitButton.mouseout(function(){
      submitIcon.subject.attr({fill:"white"});
    })

    //submit event handler to save file
    submitButton.click(function(){
        //saveTextAsFile();
    // How to send code to PHP
    $.post("save.php",{data: printData(ftWallArray,ftNorth)});
    var win=window.open("../cgi-bin/run_remesher_and_lsvo.sh?/server_data/wallfiles/cat.wall+/server_data", '_blank')
    // Running josh's scripty bit!
    //window.setTimeout(function(){location.reload();},6000); 
    });

    /*********************************************************************
    *
    * Nowth Arrow
    * + toRadians
    * + ftNorth
    *
    **********************************************************************/
   
    var ftNorth = left_paper.freeTransform(
            left_paper.path('M24.086,20.904c-1.805,3.113-5.163,5.212-9.023,5.219c-5.766-0.01-10.427-4.672-10.438-10.435C4.636,9.922,9.297,5.261,15.063,5.25c3.859,0.007,7.216,2.105,9.022,5.218l3.962,2.284l0.143,0.082C26.879,6.784,21.504,2.25,15.063,2.248C7.64,2.25,1.625,8.265,1.624,15.688c0.002,7.42,6.017,13.435,13.439,13.437c6.442-0.002,11.819-4.538,13.127-10.589l-0.141,0.081L24.086,20.904zM28.4,15.688l-7.15-4.129v2.297H10.275v3.661H21.25v2.297L28.4,15.688z').attr({fill: "white", stroke: "none", opacity: .8}),
            {drag:false, scale:false, rotate: 'self'},
            function(ft,events){
                if(events == "rotate"){
                    north_text.attr({text: String(toRadians(Math.floor(ftNorth.attrs.rotate)))});
                }
            });
    
    ftNorth.hideHandles({undrag:false})

    //Setting up location/scale of north arrow
    ftNorth.attrs.translate.x += 6*ftShapeTab.attrs.size.x/10 + ftShapeTab.attrs.x;
    ftNorth.attrs.translate.y += 1.5*ftShapeTab.attrs.size.y/5 + ftShapeTab.attrs.y;
    ftNorth.attrs.scale.x *= 3.5;
    ftNorth.attrs.scale.y *= 3.5;
   ftNorth.apply();

    function toRadians (angle) {
        if(angle  < 0){
            angle = Math.abs(angle);
        }else if(angle>0){
            angle = 180 - angle;
            angle +=180;
        }
          
        angle =  angle * (Math.PI / 180);
        return Number((angle).toFixed(2));
    }

    //Converts to regular usage of angle
    function toCompass(angle){
       return -1*angle;
    } 



    /*********************************************************************
    *
    * Creating Sam
    *
    **********************************************************************/
   
    var sam = left_paper.path("M21.021,16.349c-0.611-1.104-1.359-1.998-2.109-2.623c-0.875,0.641-1.941,1.031-3.103,1.031c-1.164,0-2.231-0.391-3.105-1.031c-0.75,0.625-1.498,1.519-2.111,2.623c-1.422,2.563-1.578,5.192-0.35,5.874c0.55,0.307,1.127,0.078,1.723-0.496c-0.105,0.582-0.166,1.213-0.166,1.873c0,2.932,1.139,5.307,2.543,5.307c0.846,0,1.265-0.865,1.466-2.189c0.201,1.324,0.62,2.189,1.463,2.189c1.406,0,2.545-2.375,2.545-5.307c0-0.66-0.061-1.291-0.168-1.873c0.598,0.574,1.174,0.803,1.725,0.496C22.602,21.541,22.443,18.912,21.021,16.349zM15.808,13.757c2.362,0,4.278-1.916,4.278-4.279s-1.916-4.279-4.278-4.279c-2.363,0-4.28,1.916-4.28,4.279S13.445,13.757,15.808,13.757z")
      .attr({fill: "black", stroke: "none"});
    var ftSam = left_paper.freeTransform(sam,{drag:false, scale:false});
    ftSam.attrs.scale.x = 2;
    ftSam.attrs.scale.y = 2;
    ftSam.attrs.translate.x = xScale(40) + ftShapeTab.attrs.x;
    ftSam.attrs.translate.y = 4.5*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y - ftSam.attrs.size.y *ftSam.attrs.scale.y;
    ftSam.hideHandles();
    ftSam.apply();

    var samHeight = ftSam.attrs.size.y * ftSam.attrs.scale.y;
    var samYPos = 4.5*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y;
    var samWall = left_paper.rect(
        ftShapeTab.attrs.x + xScale(20),
        4.5*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y -ftSam.attrs.size.y * ftSam.attrs.scale.y,
        inches2pixles(.5),
        ftSam.attrs.size.y * ftSam.attrs.scale.y)
      .attr({fill:"white"});
    
    /*********************************************************************
    *
    * Creating Camera POV
    *
    **********************************************************************/

    var path_a = left_paper.path("M8.5,6C2.5,6,0,6.828,0,7.484c0,0.467,0,10.557,0,11.032C0,19.156,2.5,20,8.5,20s8.5-0.828,8.5-1.484 c0-0.484,0-10.575,0-11.031C17,6.844,14.5,6,8.5,6z"); path_a.attr({fill: '#333333','stroke-width': '0','stroke-opacity': '1'}).data('id', 'path_a'); 

    var path_b = left_paper.path("M24.904,6.199l-6.508,4.173C18.146,10.56,18,10.857,18,11.172v3.641c0,0.314,0.146,0.611,0.396,0.801 l6.508,4.187c0.177,0.134,1.047,0.563,1.047-0.8V7C25.951,5.74,25.206,5.971,24.904,6.199z"); path_b.attr({fill: '#333333','stroke-width': '0','stroke-opacity': '1'}).data('id', 'path_b');

    var camera = left_paper.set();
    camera.push(path_a,path_b);

    var ftCamera = left_paper.freeTransform(camera, {scale:false});
    ftCamera.attrs.scale.x = 2;
    ftCamera.attrs.scale.y = 2;
    ftCamera.attrs.translate.x = 4.5*ftShapeTab.attrs.size.x/10 + ftShapeTab.attrs.x;
    ftCamera.attrs.translate.y = 2*ftShapeTab.attrs.size.y/5  + ftShapeTab.attrs.y;
    ftCamera.apply();

    
    /*********************************************************************
    *
    * Init Functions (initalization of walls + windows)
    *
    **********************************************************************/

    function initalize_walls(WALL_NUM){
        
        // Array storing Walls in
        ftWallArray = new Array();
        
        // Temp wall index to keep track how many walls made so far
        var wallIndex = 0;

        // Make 5ft green walls
        for(var i = 0; i < WALL_NUM; i++){

            var ftWall = left_paper.freeTransform(
                wall = left_paper.rect(
                    (ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x, 
                    (ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y,
                    inches2pixles(8),
                    inches2pixles(.25)).attr({
                        fill:"green",
                        opacity:1,
                        stroke: 'green',
                        'stroke-width':5
                    }).mouseover(function(){
                      //Where I will change sam's wall to reflect change
                      samWall.attr({fill:"green"});
                      samWall.attr({height:samHeight*1});
                      samWall.attr({y: samYPos - samHeight*1});
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
            ftWall.idNumber = wallIndex;
            ftWall.idPair = null;

            //Hiding handlebars, will appear after moved
            ftWall.hideHandles({undrag:false});

            //Adding to Array
            ftWallArray[wallIndex] = ftWall;
            wallIndex ++;

        }//for 5ft
       

        // Make 8ft blue walls
        for(var i = 0; i < WALL_NUM; i++){

            var ftWall = left_paper.freeTransform(
                wall = left_paper.rect(
                    (ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x, 
                    2*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y,
                    inches2pixles(8),
                    inches2pixles(.25)).attr({
                        fill:"blue",
                        opacity:1,
                        stroke: 'blue',
                        'stroke-width':5
                        }).mouseover(function(){
                      //Where I will change sam's wall to reflect change
                      samWall.attr({fill:"blue"});
                      samWall.attr({height:samHeight*1.5});
                      samWall.attr({y: samYPos - samHeight*1.5});
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
            ftWall.idNumber = wallIndex;
            ftWall.idPair = null;

            //Hiding handlebars, will appear after moved
            ftWall.hideHandles({undrag:false});

            //Adding to Array
            ftWallArray[wallIndex] = ftWall;
            wallIndex ++;

        }//for 8ft

       
        // Make 10ft red walls
        for(var i = 0; i < WALL_NUM; i++){

            var ftWall = left_paper.freeTransform(
                wall = left_paper.rect(
                    (ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x, 
                    3*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y,
                    inches2pixles(8),
                    inches2pixles(.25)).attr({
                        fill:"red",
                        opacity:1,
                        stroke: 'red',
                        'stroke-width':5
                        }).mouseover(function(){
                      //Where I will change sam's wall to reflect change
                      samWall.attr({fill:"red"});
                      samWall.attr({height:samHeight*2});
                      samWall.attr({y: samYPos - samHeight*2});
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
            ftWall.idNumber = wallIndex;
            ftWall.idPair = null;

            //Hiding handlebars, will appear after moved
            ftWall.hideHandles({undrag:false});

            //Adding to Array
            ftWallArray[wallIndex] = ftWall;
            wallIndex ++;

        }//for 8ft
       
        // Return  the array of walls
        return ftWallArray;

    }//init_walls

    function initalize_windows(WIN_NUM){
       
         
        //Array storing Walls in
        ftWinArray = new Array();
        
        // Make WALL_NUM walls
        for(var i = 0; i < WIN_NUM; i++){
            
      
            var ftWin = left_paper.freeTransform(
                win = left_paper.rect(
                    3*(ftShapeTab.attrs.size.x / 10.0) + ftShapeTab.attrs.x, 
                    2*(ftShapeTab.attrs.size.y / 5.0) + ftShapeTab.attrs.y,
                    inches2pixles(2),
                    inches2pixles(.25))
                .attr({fill:"#7adac6", opacity:.5,stroke:'#7adac6','stroke-width':5})
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
 
    /*********************************************************************
    *
    * Event handlers (for wall)
    *
    * + wall_drag_start
    * + wall_drag_move
    * + wall_drag_end
    * + wall_rotate
    *
    **********************************************************************/

    function wall_drag_start(ftWall){draggingShape = true;}
    function wall_drag_end(ftWall){ 
            ftWall.showHandles(); 
        // Snap walls back to the start place
        // jump
        // Get the walls size
        //var wall_x = ftWall.attrs.translate.x +  ftWall.attrs.x; 
        //var wall_y = ftWall.attrs.translate.y + ftWall.attrs.y;
        // Am i on the table?
        //if(onTable(wall_x,wall_y)){
        //    ftWall.showHandles(); 
        //}else{
        //}
    }

    
    function wall_drag_move(ftWall){
        
        // if Wall is a part of pair, move that window
        if(ftWall.idPair != null){

            ftWin = ftWindowArray[ftWall.idPair];

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
    
  
    /*********************************************************************
    *
    * Event handlers (for window)
    *
    * + win_drag_start
    * + win_drag_move
    * + win_drag_end
    * + win_rotate
    * + wallNear
    *
    **********************************************************************/

    //WINDOW HANDLER FUNCTIONS
    function win_drag_start(ftWin){draggingShape = true;}

    function win_rotate(ftWin){}
    
    function win_drag_move(ftWin){

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

    }//win_drag_move
    
    function win_drag_end(ftWin){

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
 
        //Join them
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
                ftWin.subject.attr({opacity: 1});
            }

            // Snap back to oringal location
            ftWin.attrs.translate.x = 0;
            ftWin.attrs.translate.y = 0;
            ftWin.attrs.rotate = 0;
            ftWin.subject.attr({opacity: 1});
            ftWin.apply();
        }

    }//win_drag_end

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
 
    /*********************************************************************
    *
    * Coordinates getter
    * + upperRight
    * + lowerRight
    * + upperLeft
    * + lowerLeft
    * + toRect
    * + onTable
    * + ...Few more conversions
    *
    *
    **********************************************************************/


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

    function onTable(x,y){
        cx = table.attr('cx');
        cy = table.attr('cy');
        rad = table.attr('r');
        distance = Math.sqrt(Math.pow(cx-x,2) + Math.pow(cy-y,2));
        return distance < rad;
    }

    //Converting measures
    function inch2meter(num){return num/39.3701;}
    function meter2inches(num){ return num*39.3701;} 

    function getHeight(num){
       return Math.round(10000*inch2meter(num))/10000; 
    }
  
    /*********************************************************************
    *
    * Pickeling the data
    *
    **********************************************************************/

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
            w = wall.attrs.size.x*wall.attrs.scale.x,
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

                //Addtional Walls  Types
                
                var wall_color = wall.subject.attr('fill');
                
                if(wall_color == "green"){
                  logWall += toStr(getHeight(5)) + "\n";

                }else if(wall_color == "blue"){
                  logWall += toStr(getHeight(8)) + "\n";

                }else if(wall_color == "red"){
                  logWall += toStr(getHeight(10)) + "\n";
                
                }

                if(wall.idPair != null){
                 
                    var wall = ftWinArray[wall.idPair],
                    x = wall.attrs.x + wall.attrs.translate.x,
                    y = wall.attrs.y + wall.attrs.translate.y,
                    w = wall.attrs.size.x * wall.attrs.scale.x,
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

    /* Camera Pov / People(s) */
    if(onTable(ftCamera.attrs.center.x + ftCamera.attrs.translate.x , ftCamera.attrs.center.y + ftCamera.attrs.translate.y)){

      //NaN for distance
      
      var distance = Math.sqrt(
          Math.pow(table.attr('cx') - (ftCamera.attrs.center.x + ftCamera.attrs.translate.x) ,2) + 
          Math.pow(table.attr('cy') - (ftCamera.attrs.center.y + ftCamera.attrs.translate.y) ,2),
          2);

      console.log(distance);

      var camera_angle = ftCamera.attrs.rotate;
      var camera_angle = toRadians(camera_angle);

      console.log(camera_angle);
      
      var camera_pos = toRect(distance, camera_angle);
      
      log += "person" + "  " + 
        Math.round(toStr(camera_pos[0])*10000)/10000 + "  " + 
        Math.round(toStr(camera_pos[1])*10000)/10000 + "  " + 
        toStr(toRadians(ftCamera.attrs.rotate))+ "  " +
        "+0.0686\n";
    }
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
}
