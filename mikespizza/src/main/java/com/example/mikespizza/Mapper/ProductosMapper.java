package com.example.mikespizza.Mapper;

import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.dto.ProductosDTO;

public class ProductosMapper {

    public static ProductosDTO toDTO(Producto producto) {
        return new ProductosDTO(
            producto.getProductoId(),
            producto.getNombreProducto(),
            producto.getCategoria(),
            producto.getDescripcion(),
            producto.getIngredientes(),
            producto.getImagen_url(),
            producto.getPrecio_personal(),
            producto.getPrecio_grande()
        );
    }

    // Para productos solo con precio personal
    public static ProductosDTO toPersonalDTO(Producto producto) {
        return new ProductosDTO(
            producto.getProductoId(),
            producto.getNombreProducto(),
            producto.getCategoria(),
            producto.getDescripcion(),
            producto.getIngredientes(),
            producto.getImagen_url(),
            producto.getPrecio_personal()
        );
    }
}
