package com.example.mikespizza.Mapper;

import com.example.mikespizza.Model.DetallePedido;
import com.example.mikespizza.dto.DetallePedidoDTO;

public class DetallePedidoMapper {
     public static DetallePedidoDTO toDTO(DetallePedido detalle) {
        return new DetallePedidoDTO(
            detalle.getDetalleId(),
            detalle.getPedido().getPedidoId(), 
            detalle.getProducto().getProducto_id(),
            detalle.getProducto().getNombre_producto(),
            detalle.getCantidad(),
            detalle.getPrecioUnitario(),
            detalle.getTamanio(),
            detalle.getSubtotal()
        );
    }
}

