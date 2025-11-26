package com.example.mikespizza.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Service.ProductosService;
import com.example.mikespizza.dto.ProductosDTO;

@RestController
@RequestMapping("/productos")
public class ProductosController {

    @Autowired
    private ProductosService productosService;

    @PostMapping("/crear")
    public ProductosDTO crearProducto(@RequestBody ProductosDTO dto) {
        return productosService.crearProducto(dto);
    }

    @GetMapping("/listar")
    public List<ProductosDTO> listarProductos() {
        return productosService.listarProductos();
    }

    @GetMapping("/{id}")
    public ProductosDTO obtenerProducto(@PathVariable Long id) throws Exception {
        return productosService.obtenerProducto(id);
    }

    @PutMapping("/actualizar/{id}")
    public ProductosDTO actualizarProducto(@PathVariable Long id, @RequestBody ProductosDTO dto) throws Exception {
        return productosService.actualizarProducto(id, dto);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productosService.eliminarProducto(id);
    }
}
