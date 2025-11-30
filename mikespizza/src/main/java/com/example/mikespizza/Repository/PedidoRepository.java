package com.example.mikespizza.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mikespizza.Model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario_IdOrderByFechaPedidoDesc(Long usuarioId);
    List<Pedido> findByUsuario_Id(Long usuarioId);
}

