package com.example.mikespizza.Factory;

import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.Model.Pedido.EstadoPedido;
import com.example.mikespizza.Model.User;

public class PedidoFactory {
    public static Pedido crearPedido(User usuario, EstadoPedido estado, Double total, 
                                      String direccionEntrega, String telefonoContacto, String notas) {
        return new Pedido(usuario, estado, total, direccionEntrega, telefonoContacto, notas);
    }
    
    public static Pedido crearPedidoPendiente(User usuario, Double total, String direccionEntrega, 
                                               String telefonoContacto, String notas) {
        return new Pedido(usuario, EstadoPedido.PENDIENTE, total, direccionEntrega, telefonoContacto, notas);
    }
}
