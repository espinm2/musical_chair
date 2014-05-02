<?php

  /*Each object needs to have the following in its state properties
   *  bounding surfaces  -- requires way to keep track of the back of elements(might be hard)
   *  center -- p_i denotes center of an object, center of bounding box
   *  orientation -- denotes angle from object to nearest wall
   *  accessiable space -- make box around larger of table (don't implement yet)
   *  viewing frustum -- series of boxes in increasing size in front of something that is viewed (right side of desk)
   *  lighting -- a number from 0 - 1 that indicates how white the floor is below an object
   */

  // Making the assumption that in the js file I have defined varibles I need to run
  $state_file = "../output/wallfiles/desk.st";
  $handle = fopen($state_file, 'w') or die ('Connot open file: '.$state_file);

  // this command get the string data and readies for saving
  // HOW TO GET VARIBLES FROM JS CODE
  $data = $_POST['data'];

  fwrite($handle, $data);
  fclose($handle);
?>

