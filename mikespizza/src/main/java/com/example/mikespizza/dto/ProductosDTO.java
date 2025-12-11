package com.example.mikespizza.dto;

import com.example.mikespizza.Model.Producto.CategoriaProducto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProductosDTO {
    private Long producto_id;

    @NotBlank(message = "El nombre del producto no puede estar vacío")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre_producto;

    @NotNull(message = "La categoría no puede ser nula")
    private CategoriaProducto categoria;

    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    @Size(max = 300, message = "Los ingredientes no pueden exceder 300 caracteres")
    private String ingredientes;

    private String imagen_url;

    @NotNull(message = "El precio personal no puede ser nulo")
    @DecimalMin(value = "0.01", message = "El precio personal debe ser mayor a 0")
    private Double precio_personal;

    @DecimalMin(value = "0.01", message = "El precio grande debe ser mayor a 0")
    private Double precio_grande;

    public ProductosDTO() {}

    public ProductosDTO(Long producto_id, String nombre_producto, CategoriaProducto categoria, 
                       String descripcion, String ingredientes, String imagen_url, 
                       Double precio_personal, Double precio_grande) {
        this.producto_id = producto_id;
        this.nombre_producto = nombre_producto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.imagen_url = imagen_url;
        this.precio_personal = precio_personal;
        this.precio_grande = precio_grande;
    }

    public ProductosDTO(Long producto_id, String nombre_producto, CategoriaProducto categoria, 
                       String descripcion, String ingredientes, String imagen_url, 
                       Double precio_personal) {
        this.producto_id = producto_id;
        this.nombre_producto = nombre_producto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.imagen_url = imagen_url;
        this.precio_personal = precio_personal;
        this.precio_grande = null;
    }
    
    public Long getProducto_id() { return producto_id; }
    public void setProducto_id(Long producto_id) { this.producto_id = producto_id; }

    public String getNombre_producto() { return nombre_producto; }
    public void setNombre_producto(String nombre_producto) { this.nombre_producto = nombre_producto; }

    public CategoriaProducto getCategoria() { return categoria; }
    public void setCategoria(CategoriaProducto categoria) { this.categoria = categoria; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getIngredientes() { return ingredientes; }
    public void setIngredientes(String ingredientes) { this.ingredientes = ingredientes; }

    public String getImagen_url() { return imagen_url; }
    public void setImagen_url(String imagen_url) { this.imagen_url = imagen_url; }

    public Double getPrecio_personal() { return precio_personal; }
    public void setPrecio_personal(Double precio_personal) { this.precio_personal = precio_personal; }

    public Double getPrecio_grande() { return precio_grande; }
    public void setPrecio_grande(Double precio_grande) { this.precio_grande = precio_grande; }
}
