<?php
require 'ConexaoService.php';

class LoginService extends db
{
    public static function login($jsonValuesUsers) {

        $user[] = $jsonValuesUsers;

       if (!empty($user[0]['user'])) {
        $mysql = new db();
        $sql = "SELECT count(*) as total, nome_atendente, id_atendente
                FROM atendentes 
                WHERE nome_atendente = '{$user[0]['user']}' AND matricula_atendente = {$user[0]['password']} ";
        $res = $mysql->selected($sql);
        print_r($res);
        }
    }


}