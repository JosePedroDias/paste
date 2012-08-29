<?php

    //return print_r($_REQUEST);
    


    // extract request data
    $op = $_REQUEST['op'];
    $id = $_REQUEST['id'];
    $t  = $_REQUEST['t'];



    // validate id
    if ($op !== 'list' && (!preg_match('/^[a-z0-9_]{1,32}$/', $id))) {
        echo 'invalid id!';
        exit(0);
    }


    $dn = 'pastes';
    $fn = $dn . '/' . $id;



    // process operation
    if ($op === 'load') {
        if (file_exists($fn)) {
            echo file_get_contents($fn);
        }
        else {
            echo '';
        }
        
    }
    elseif ($op === 'save') {
        file_put_contents($fn, $t);
    }
    elseif ($op === 'exists') {
        echo (file_exists($fn) ? 'true' : 'false');
    }
    elseif ($op === 'list') {
        $files = scandir($dn);
        array_shift($files);
        array_shift($files);
        echo json_encode($files);
    }
    else {
        echo 'Unsupported op!';
    }
