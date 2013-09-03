<?php

    //return print_r($_REQUEST);



    // extract request data
    $op = $_REQUEST['op'];
    $id = $_REQUEST['id'];
    $t  = $_REQUEST['t'];


    function is_valid_id($id) {
        return preg_match('/^[a-z0-9_]{1,32}$/', $id);
    }



    // validate id
    if ($op !== 'list' && is_valid_id($id)) {
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

        // store with timestamp also, so we can restore it in case of bad editing
        $d = gmdate(' Y-m-d H:i:s');
        file_put_contents($fn . $d, $t);
    }
    elseif ($op === 'exists') {
        echo (file_exists($fn) ? 'true' : 'false');
    }
    elseif ($op === 'list') {
        $files = scandir($dn);

        // remove . and ..
        array_shift($files);
        array_shift($files);

        // filter timestamped copies
        $files = array_filter($files, is_valid_id);

        echo json_encode($files);
    }
    else {
        echo 'Unsupported op!';
    }
