<?php require_once('config.php'); 
   
	$size =  sizeof($_FILES['uploadFile']['name']);
    $data = array();
    $data['img'] = array();
    for($i=0; $i<$size;$i++)
    {
        $filen= "/assets/image/".$_FILES['uploadFile']['name'][$i];
        move_uploaded_file($_FILES['uploadFile']['tmp_name'][$i],$ROOT_PATH.$filen);
    
        array_push($data['img'], $host.$filen);
        
    }

    echo json_encode($data);
 
