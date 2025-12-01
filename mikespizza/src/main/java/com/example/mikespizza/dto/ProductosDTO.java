package com.example.mikespizza.dto;

import com.example.mikespizza.Model.Producto.CategoriaProducto;

public class ProductosDTO {
    private Long producto_id;
    private String nombre_producto;
    private CategoriaProducto categoria;
    private String descripcion;
    private String ingredientes;
    private String imagen_url;
    private Double precio_personal;
    private Double precio_grande; 

    public ProductosDTO() {}

    public ProductosDTO(Long producto_id, String nombre_producto, CategoriaProducto categoria, String descripcion, String ingredientes, String imagen_url, Double precio_personal, Double precio_grande) {
        this.producto_id = producto_id;
        this.nombre_producto = nombre_producto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.imagen_url = imagen_url;
        this.precio_personal = precio_personal;
        this.precio_grande = precio_grande;
    }

    public ProductosDTO(Long producto_id, String nombre_producto, CategoriaProducto categoria, String descripcion, String ingredientes, String imagen_url, Double precio_personal) {
        this.producto_id = producto_id;
        this.nombre_producto = nombre_producto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.imagen_url = imagen_url;
        this.precio_personal = precio_personal;
        this.precio_grande = null;
    }
    
    public Long getProducto_id() {
        return producto_id;
    }

    public void setProducto_id(Long producto_id) {
        this.producto_id = producto_id;
    }

    public String getNombre_producto() {
        return nombre_producto;
    }

    public void setNombre_producto(String nombre_producto) {
        this.nombre_producto = nombre_producto;
    }

    public CategoriaProducto getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaProducto categoria) {
        this.categoria = categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIngredientes() {
        return ingredientes;
    }

    public void setIngredientes(String ingredientes) {
        this.ingredientes = ingredientes;
    }

    public String getImagen_url() {
        return imagen_url;
    }

    public void setImagen_url(String imagen_url) {
        this.imagen_url = imagen_url;
    }

    public Double getPrecio_personal() {
        return precio_personal;
    }

    public void setPrecio_personal(Double precio_personal) {
        this.precio_personal = precio_personal;
    }

    public Double getPrecio_grande() {
        return precio_grande;
    }

    public void setPrecio_grande(Double precio_grande) {
        this.precio_grande = precio_grande;
    }
}
