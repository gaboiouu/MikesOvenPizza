package com.example.mikespizza.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.mikespizza.Model.Pedido.EstadoPedido;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PedidoDTO {
    private Long pedidoId;

    @NotNull(message = "El ID del usuario no puede ser nulo")
    private Long userId;

    @NotEmpty(message = "El pedido debe tener al menos un detalle")
    @Valid
    private List<DetallePedidoDTO> detalles;

    private LocalDateTime fechaPedido;

    @NotNull(message = "El estado del pedido no puede ser nulo")
    private EstadoPedido estado;

    @NotNull(message = "El total no puede ser nulo")
    @DecimalMin(value = "0.01", message = "El total debe ser mayor a 0")
    private Double total;

    @Size(min = 10, max = 200, message = "La dirección debe tener entre 10 y 200 caracteres")
    private String direccionEntrega;

    @NotBlank(message = "El teléfono de contacto no puede estar vacío")
    @Pattern(regexp = "^[0-9]{9,15}$", message = "Formato de teléfono inválido (solo números, 9-15 dígitos)")
    private String telefonoContacto;

    @Size(max = 500, message = "Las notas no pueden exceder 500 caracteres")
    private String notas;
    
    private UsuarioDTO usuario;

    public PedidoDTO() {}

    public PedidoDTO(Long pedidoId, Long userId, List<DetallePedidoDTO> detalles, 
                     LocalDateTime fechaPedido, EstadoPedido estado, Double total, 
                     String direccionEntrega, String telefonoContacto, String notas,
                     UsuarioDTO usuario) {
        this.pedidoId = pedidoId;
        this.userId = userId;
        this.detalles = detalles;
        this.fechaPedido = fechaPedido;
        this.estado = estado;
        this.total = total;
        this.direccionEntrega = direccionEntrega;
        this.telefonoContacto = telefonoContacto;
        this.notas = notas;
        this.usuario = usuario;
    }

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

    public UsuarioDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioDTO usuario) { this.usuario = usuario; }

    public static class UsuarioDTO {
        private Long id;
        private String nombreCompleto;
        private String email;

        public UsuarioDTO() {}

        public UsuarioDTO(Long id, String nombreCompleto, String email) {
            this.id = id;
            this.nombreCompleto = nombreCompleto;
            this.email = email;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }
}
