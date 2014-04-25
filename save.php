<?php

  $wall_file = "../output/wallfiles/cat.wall";
  $handle = fopen($wall_file, 'w') or die ('Connot open file: '.$wall_file);

  $data = $_POST['data'];

  fwrite($handle, $data);
  fclose($handle);

?>

