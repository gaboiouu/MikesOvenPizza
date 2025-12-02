package com.example.mikespizza.Mapper;

import java.util.stream.Collectors;

import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.dto.PedidoDTO;

public class PedidoMapper {
    
    public static PedidoDTO toDTO(Pedido pedido) {
        PedidoDTO dto = new PedidoDTO();
        dto.setPedidoId(pedido.getPedidoId());
        dto.setUserId(pedido.getUsuario().getId());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setEstado(pedido.getEstado());
        dto.setTotal(pedido.getTotal());
        dto.setDireccionEntrega(pedido.getDireccionEntrega());
        dto.setTelefonoContacto(pedido.getTelefonoContacto());
        dto.setNotas(pedido.getNotas());
        
        // ✅ AGREGADO: Mapear información del usuario
        if (pedido.getUsuario() != null) {
            PedidoDTO.UsuarioDTO usuarioDTO = new PedidoDTO.UsuarioDTO(
                pedido.getUsuario().getId(),
                pedido.getUsuario().getNombreCompleto(),
                pedido.getUsuario().getEmail()
            );
            dto.setUsuario(usuarioDTO);
        }
        
        // Mapear detalles
        dto.setDetalles(
            pedido.getDetalles().stream()
                .map(DetallePedidoMapper::toDTO)
                .collect(Collectors.toList())
        );
        
        return dto;
    }
}
