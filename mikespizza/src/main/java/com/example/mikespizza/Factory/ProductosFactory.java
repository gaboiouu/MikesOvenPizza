package com.example.mikespizza.Factory;

import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.Model.Producto.CategoriaProducto;

public class ProductosFactory {
    public static Producto creaProducto(String nombre_producto, CategoriaProducto categoria, String descripcion, String ingredientes, String imagen_url, Double precio_personal, Double precio_grande) {
        return new Producto(nombre_producto, categoria, descripcion, ingredientes, imagen_url, precio_personal, precio_grande);
    }

     public static Producto creaProductoPersonal(String nombre_producto, CategoriaProducto categoria, String descripcion, String ingredientes, String imagen_url, Double precio_personal) {
        return new Producto(nombre_producto, categoria, descripcion, ingredientes, imagen_url, precio_personal);
    }
}
