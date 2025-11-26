package com.example.mikespizza.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mikespizza.Model.Producto;

public interface ProductosRepository extends JpaRepository<Producto, Long> {

}
