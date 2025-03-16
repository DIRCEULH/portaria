

<?php
require 'ConexaoService.php';

class ClientesService extends db
{


    public static function showAttendants() {
        $mysql = new db();
        $sql = "SELECT * FROM atendentes";
        $res = $mysql->select($sql);
        print_r(json_encode($res));
    }

    public static function  showCustomers($dateRegistration )
    {  
 
        if (empty($dateRegistration)) {
            $where = " WHERE cast(v.data_registro as date) = cast(now() as date)";
        } else {
         
            $where = " WHERE cast(v.data_registro as date)= cast('{$dateRegistration}' as date)";
        }
        $mysql = new db();
        $sql = "SELECT   (select count(id_visitante) from visitantes   WHERE cast(data_registro as date) = cast('{$dateRegistration}' as date) )  as total
         , v.id_visitante
         , v.data_registro
         , v.nome_visitante
         , v.cpf_cnpj
         , v.empresa
         , v.data_entrada
         , v.data_saida
         , v.placa_veiculo
         , v.destino_setor
         , v.status
         , CONCAT(v.atendente, ' - ', a.nome_atendente) atendente
         , v.observacao FROM visitantes v
         INNER JOIN atendentes a
         ON a.id_atendente = v.atendente
         {$where} order by v.data_registro desc";

        $res = $mysql->select($sql);
        print_r(json_encode($res));
    }

    public static function  showVisitors( )
    {  
 
        $mysql = new db();
        $sql = "SELECT  DISTINCT
                v.nome_visitante
                , v.cpf_cnpj
                FROM visitantes v ";

        $res = $mysql->select($sql);
        print_r(json_encode($res));
    }

    public static function updateVisitor ($jsonValuesVisitor)
    {
        $values[] = $jsonValuesVisitor;

        if (!empty($values[0]['id_visitante'])) {
            $mysql = new db();
            $sql = "UPDATE visitantes SET data_saida = '{$values[0]['data_saida']}', status = 1  WHERE  id_visitante = {$values[0]['id_visitante']}  ";
            $mysql->update($sql);
        }

    }

    public static function  saveCustomers( $json_value)
    {   
        
        $values[] = $json_value;
      
        if (empty($values[0]['id_visitante'])) {

            $mysql = new db();
            $sql = "INSERT INTO visitantes (
            nome_visitante
            , cpf_cnpj
            , empresa
            , data_entrada
            , placa_veiculo
            , destino_setor
            , atendente
            , observacao)
            values(
              '{$values[0]['nome_visitante']}'
            , '{$values[0]['cpf_cnpj']}'
            , '{$values[0]['empresa']}'
            , '{$values[0]['data_entrada']}'
            , '{$values[0]['placa_veiculo']}'
            , '{$values[0]['destino']}'
            , '{$values[0]['atendente']}'
            , '{$values[0]['observacao']}')";

            $mysql->insert($sql);
           
        }
    
    }

    public static function  saveAttendant( $jsonValuesAttendant)
    {   
        
        $atendentes[] = $jsonValuesAttendant;

        if (!empty($values[0]['id_atendente'])) {
            $mysql = new db();
            $sql = "UPDATE atendentes SET nome_atendente = '{$atendentes[0]['nome_atendente']}' , matricula_atendente= $atendentes[0]['matricula_atendente']  ";
            $mysql->update($sql);
        } else {
            $mysql = new db();
            $sql = "INSERT INTO atendentes (nome_atendente, matricula_atendente)
            VALUES('{$atendentes[0]['nome_atendente']}', {$atendentes[0]['matricula_atendente']} )";
            $mysql->insert($sql);
           
        }
    
    }

    public static function  deleteCustomers($id)
    {
        $mysql = new db();
        $sql = "DELETE FROM tab_clientes WHERE id = $id ";
        $mysql->delete($sql);
    }
}
?>