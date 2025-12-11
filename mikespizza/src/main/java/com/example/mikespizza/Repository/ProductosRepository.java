package com.example.mikespizza.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.Model.Producto.CategoriaProducto;

public interface ProductosRepository extends JpaRepository<Producto, Long> {
    
    List<Producto> findByCategoria(CategoriaProducto categoria);
    
    Page<Producto> findAllByOrderByNombreProductoAsc(Pageable pageable);
    
    @Query("SELECT p FROM Producto p WHERE " +
           "(:categoria IS NULL OR p.categoria = :categoria) AND " +
           "(:precioMin IS NULL OR p.precio_personal >= :precioMin) AND " +
           "(:precioMax IS NULL OR p.precio_personal <= :precioMax) AND " +
           "(:nombre IS NULL OR LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :nombre, '%')))")
    Page<Producto> buscarProductosConFiltros(
        @Param("categoria") String categoria,
        @Param("precioMin") Double precioMin,
        @Param("precioMax") Double precioMax,
        @Param("nombre") String nombre,
        Pageable pageable
    );
}
