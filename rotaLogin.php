<?php

require 'ServicesPhp/LoginService.php';

if ($_REQUEST['rota'] == 'login') {
  
    $user = $_REQUEST['jsonValuesUsers'];

    return  LoginService::login($user);

 }