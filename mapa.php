<?php
require 'ServicesPhp/ClientesService.php';

if ($_REQUEST['rota'] == 'visitors') {

   $visitors = $_REQUEST['jsonValuesVisitor'];

    ClientesService::updateVisitor($visitors);
}


if ($_REQUEST['rota'] == 'saveAttendant') {

   $atendentes = $_REQUEST['jsonValuesAttendant'];

   ClientesService::saveAttendant($atendentes);
}


if ($_REQUEST['rota'] == 'clientes') {
  
   $date = $_REQUEST['dateRegistration'];
 
   return ClientesService::showCustomers($date);
}

if ($_REQUEST['rota'] == 'visitorsFilter') {
 
   return ClientesService::showVisitors();
}

if ($_REQUEST['rota'] == 'saveCustomers') {

   ClientesService::saveCustomers($_REQUEST['json_values']);
}


if ($_REQUEST['rota'] == 'attendants') {

   ClientesService::showAttendants();
}



// if ($_REQUEST['rota'] == 'deleteCustomers') {

//    ClientesService::deleteCustomers($_REQUEST['id']);
// }


