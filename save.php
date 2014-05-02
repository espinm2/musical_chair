<?php

  $wall_file = "../output/wallfiles/cat.wall";
  $handle = fopen($wall_file, 'w') or die ('Connot open file: '.$wall_file);

  // this command get the string data and readies for saving
  // HOW TO GET VARIBLES FROM JS CODE
  $data = $_POST['data'];

  fwrite($handle, $data);
  fclose($handle);

?>

