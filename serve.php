<?php

    $id = $_REQUEST['id'];



    function is_valid_id($id) {
        return preg_match('/^[a-z0-9_]{1,32}$/', $id);
    }



    // validate id
    if ($op !== 'list' && !is_valid_id($id)) {
        echo 'invalid id!';
        exit(0);
    }


    $dn = 'pastes';
    $fn = $dn . '/' . $id;



    // process operation
    if (file_exists($fn)) {
    header('Content-Type: text/html');
        echo file_get_contents($fn);
    }
    else {
        echo 'inexistant id!';
    }
