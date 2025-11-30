package com.example.mikespizza.Mapper;

import java.util.stream.Collectors;

import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.dto.PedidoDTO;

public class PedidoMapper {
    public static PedidoDTO toDTO(Pedido pedido) {
        return new PedidoDTO(
            pedido.getPedidoId(),
            pedido.getUsuario().getId(),
            pedido.getDetalles().stream()
                .map(DetallePedidoMapper::toDTO)
                .collect(Collectors.toList()),
            pedido.getFechaPedido(),
            pedido.getEstado(),
            pedido.getTotal(),
            pedido.getDireccionEntrega(),
            pedido.getTelefonoContacto(),
            pedido.getNotas()
        );
    }
}
