<?php 

    
    $ROOT_PATH = $_SERVER['DOCUMENT_ROOT'].'/';
    $host      = 'http://'.$_SERVER['HTTP_HOST'].'/';
    //please change subDir name to your http://localhost/$subDIr and do it empty if in live or virtual host
    $subDir    = '/imageupload/';

    if (!empty($subDir)) {
    	$host = $host.$subDir;
    	$ROOT_PATH = $_SERVER['DOCUMENT_ROOT'].$subDir;
    }