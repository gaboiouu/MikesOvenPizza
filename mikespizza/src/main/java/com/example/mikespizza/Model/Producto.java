package com.example.mikespizza.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "producto_id")
    private Long productoId;

    @Column(name= "nombre_producto", nullable = false)
    private String nombreProducto;

    @Enumerated(EnumType.STRING)
    @Column(name= "categoria", nullable = false)
    private CategoriaProducto categoria; 

    @Column(name= "descripcion", nullable = false)
    private String descripcion;

    @Column(name= "ingredientes")
    private String ingredientes;

    @Column(name= "imagen_url")
    private String imagen_url;

    @Column(name= "precio_personal", nullable = false)
    private Double precio_personal;
    
    @Column(name= "precio_grande", nullable = true)
    private Double precio_grande;

    public Producto() {}

    public Producto(String nombreProducto, CategoriaProducto categoria, String descripcion, String ingredientes, String imagen_url, Double precio_personal, Double precio_grande) {
        this.nombreProducto = nombreProducto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.imagen_url = imagen_url;
        this.precio_personal = precio_personal;
        this.precio_grande = precio_grande;
    }

    public Producto(String nombreProducto, CategoriaProducto categoria, String descripcion, String ingredientes, String imagen_url, Double precio_personal) {
        this.nombreProducto = nombreProducto;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.ingredientes = ingredientes;
        this.imagen_url = imagen_url;
        this.precio_personal = precio_personal;
    }

    public Long getProductoId() {
        return productoId;
    }
    public void setProductoId(Long productoId) {
        this.productoId = productoId;
    }
    public String getNombreProducto() {
        return nombreProducto;
    }
    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
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

    public enum CategoriaProducto {
        PIZZAS_CLASICAS,
        PIZZAS_ESPECIALES,
        PIZZAS_DULCES,
        CALZONE_Y_PAN_AL_AJO,         // Aquí puedes juntar CALZONE y PAN AL AJO
        EXTRAS,
        PASTAS_PLATOS,      // Junta pastas, lasaña, milanesa, ribs
        ALITAS,
        COMPLEMENTOS,       // Junta chicken fingers, nuggets, rolls, bordes de queso
        POSTRES,
        BEBIDAS,            // Junta gaseosas, jugos, café, cervezas, vinos, refrescantes
        TRAGOS,
        PARA_COMPARTIR
    }
}