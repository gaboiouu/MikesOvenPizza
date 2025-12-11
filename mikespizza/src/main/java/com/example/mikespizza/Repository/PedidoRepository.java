package com.example.mikespizza.Repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.Model.Pedido.EstadoPedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByUsuario_Id(Long userId);
    
    List<Pedido> findByUsuario_IdOrderByFechaPedidoDesc(Long userId);
    
    Page<Pedido> findAllByOrderByFechaPedidoDesc(Pageable pageable);
        @Query("SELECT p FROM Pedido p WHERE " +
           "(:estado IS NULL OR p.estado = :estado) AND " +
           "(:fechaInicio IS NULL OR p.fechaPedido >= :fechaInicio) AND " +
           "(:fechaFin IS NULL OR p.fechaPedido <= :fechaFin) AND " +
           "(:userId IS NULL OR p.usuario.id = :userId) " +
           "ORDER BY p.fechaPedido DESC")
    Page<Pedido> buscarPedidosConFiltros(
        @Param("estado") EstadoPedido estado,
        @Param("fechaInicio") LocalDateTime fechaInicio,
        @Param("fechaFin") LocalDateTime fechaFin,
        @Param("userId") Long userId,
        Pageable pageable
    );
    
    Long countByEstado(EstadoPedido estado);
    
    @Query("SELECT p FROM Pedido p WHERE DATE(p.fechaPedido) = DATE(:fecha)")
    List<Pedido> findByFechaPedidoDate(@Param("fecha") LocalDateTime fecha);
    
    @Query("SELECT SUM(p.total) FROM Pedido p WHERE DATE(p.fechaPedido) = DATE(:fecha) AND p.estado != 'CANCELADO'")
    Double calcularVentasPorFecha(@Param("fecha") LocalDateTime fecha);
    
    @Query("SELECT COUNT(p) FROM Pedido p WHERE DATE(p.fechaPedido) = DATE(:fecha)")
    Long contarPedidosPorFecha(@Param("fecha") LocalDateTime fecha);

    @Query("SELECT DATE(p.fechaPedido), SUM(p.total), COUNT(p) " +
           "FROM Pedido p " +
           "WHERE p.fechaPedido BETWEEN :inicio AND :fin AND p.estado != 'CANCELADO' " +
           "GROUP BY DATE(p.fechaPedido) " +
           "ORDER BY DATE(p.fechaPedido)")
    List<Object[]> obtenerVentasPorDia(
        @Param("inicio") LocalDateTime inicio,
        @Param("fin") LocalDateTime fin
    );

    @Query("SELECT dp.producto.productoId, dp.producto.nombreProducto, " +
           "SUM(dp.cantidad), SUM(dp.cantidad * dp.precioUnitario) " +
           "FROM DetallePedido dp " +
           "JOIN dp.pedido p " +
           "WHERE p.estado != 'CANCELADO' " +
           "GROUP BY dp.producto.productoId, dp.producto.nombreProducto " +
           "ORDER BY SUM(dp.cantidad) DESC")
    List<Object[]> obtenerProductosMasVendidos(@Param("limit") int limit);

    @Query("SELECT p.usuario.id, p.usuario.nombreCompleto, p.usuario.email, " +
           "COUNT(p), SUM(p.total) " +
           "FROM Pedido p " +
           "WHERE p.estado != 'CANCELADO' " +
           "GROUP BY p.usuario.id, p.usuario.nombreCompleto, p.usuario.email " +
           "ORDER BY COUNT(p) DESC")
    List<Object[]> obtenerClientesFrecuentes(@Param("limit") int limit);
}

