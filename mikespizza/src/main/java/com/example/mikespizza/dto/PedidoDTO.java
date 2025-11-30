package com.example.mikespizza.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.mikespizza.Model.Pedido.EstadoPedido;

public class PedidoDTO {
    private Long pedidoId;
    private Long userId;
    private List<DetallePedidoDTO> detalles;
    private LocalDateTime fechaPedido;
    private EstadoPedido estado;
    private Double total;
    private String direccionEntrega;
    private String telefonoContacto;
    private String notas;

    public PedidoDTO() {}

    public PedidoDTO(Long pedidoId, Long userId, List<DetallePedidoDTO> detalles, 
                     LocalDateTime fechaPedido, EstadoPedido estado, Double total, 
                     String direccionEntrega, String telefonoContacto, String notas) {
        this.pedidoId = pedidoId;
        this.userId = userId;
        this.detalles = detalles;
        this.fechaPedido = fechaPedido;
        this.estado = estado;
        this.total = total;
        this.direccionEntrega = direccionEntrega;
        this.telefonoContacto = telefonoContacto;
        this.notas = notas;
    }

    // Getters y Setters
    public Long getPedidoId() { return pedidoId; }
    public void setPedidoId(Long pedidoId) { this.pedidoId = pedidoId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<DetallePedidoDTO> getDetalles() { return detalles; }
    public void setDetalles(List<DetallePedidoDTO> detalles) { this.detalles = detalles; }

    public LocalDateTime getFechaPedido() { return fechaPedido; }
    public void setFechaPedido(LocalDateTime fechaPedido) { this.fechaPedido = fechaPedido; }

    public EstadoPedido getEstado() { return estado; }
    public void setEstado(EstadoPedido estado) { this.estado = estado; }

    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }

    public String getDireccionEntrega() { return direccionEntrega; }
    public void setDireccionEntrega(String direccionEntrega) { this.direccionEntrega = direccionEntrega; }

    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String telefonoContacto) { this.telefonoContacto = telefonoContacto; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}
