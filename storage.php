<?php

    //return print_r($_REQUEST);
    
    $op = $_REQUEST['op'];
    $id = $_REQUEST['id'];
    $t  = $_REQUEST['t'];

    $fn = 'pastes/' . $id;

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
    else {
        echo 'Unsupported op!';
    }
