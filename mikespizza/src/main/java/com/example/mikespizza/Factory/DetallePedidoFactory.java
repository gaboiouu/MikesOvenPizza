package com.example.mikespizza.Factory;

import com.example.mikespizza.Model.DetallePedido;
import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.Model.Producto;

public class DetallePedidoFactory {
    public static DetallePedido crearDetalle(Pedido pedido, Producto producto, Integer cantidad, 
                                              Double precioUnitario, String tamanio) {
        return new DetallePedido(pedido, producto, cantidad, precioUnitario, tamanio);
    }
}
