<?php

use App\Core\Model;

class Cliente {
        public $id;
        public $nomeCliente;
        public $placaCarro;
        public $dataHoraEntrada;
        public $dataHoraSaida;
        public $valorTotal;
        public $precoId;


        public function listarTodos(){
            $sql = " SELEC * FROM cliente ORDER BY id DESC ";

            $stmt = Model::getConn()->prepare($sql);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                $resultado = $stmt->fetchAll(PDO::FETCH_OBJ);

                return $resultado;
            } else{
                return [];
            }
        }

    public function iserir(){
        $sql = " INSERT INTO cliente (nome_cliente, pplaca_carro, data_hora_entrada, preco_id) VALUES (?, ?, ?, ?)";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->nomeCliente);
        $stmt->bindValue(2, $this->placaCarro);
        $stmt->bindValue(3, $this->dataHoraEntrada);
        $stmt->bindValue(4, $this->dataHoraSaida);

        if ($stmt->execute()) {
            $this->id = Model::getConn()->lastInsertId();
            return $this;
        }else{
            print_r($stmt->errorInfo());
            return null;
        }
    }

    public function buscarPorId($id){
        $sql = " SELECT * FROM cliente WHERE id = ? ";
        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $id);

        if($stmt->execute()) {
            $cliente = $stmt->fetch(PDO::FETCH_OBJ);

            if (!$cliente){
                return null;
            }

            $this->id = $cliente->id;
            $this->nomeCliente = $cliente->nome_cliente;
            $this->placaCarro = $cliente->placa_carro;
            $this->dataHoraEntrada = $cliente->data_hora_entrada;
            $this->dataHoraSaida = $cliente->data_hora_saida;
            $this->valorTotal = $cliente->valor_total;
            $this->precoId = $cliente->preco_id;

            return $this;
        }else{
            return false;
        }
    }

    public function atualizar(){
        $sql = " UPDATE cliente SET data_hora_saida = ?, valor_total = ? WHERE id = ? ";

        $stmt = Model::getConn()->prepare($sql);
        $stmt->bindValue(1, $this->dataHoraSaida);
        $stmt->bindValue(2, $this->valorTotal);
        $stmt->bindValue(3, $this->id);

        return $stmt->execute();
    }
}