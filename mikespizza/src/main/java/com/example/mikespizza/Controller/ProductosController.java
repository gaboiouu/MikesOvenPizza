package com.example.mikespizza.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Service.ProductosService;
import com.example.mikespizza.dto.ProductosDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/productos")
@Validated
public class ProductosController {

    private static final Logger logger = LoggerFactory.getLogger(ProductosController.class);

    @Autowired
    private ProductosService productosService;

    @PostMapping("/crear")
    public ResponseEntity<?> crearProducto(@Valid @RequestBody ProductosDTO dto) {  // ✅ @Valid
        try {
            logger.info("🍕 Solicitud para crear producto: {}", dto.getNombre_producto());
            ProductosDTO producto = productosService.crearProducto(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(producto);
        } catch (Exception e) {
            logger.error("❌ Error al crear producto: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar")
    public ResponseEntity<List<ProductosDTO>> listarProductos() {
        logger.info("📋 Solicitud para listar productos");
        List<ProductosDTO> productos = productosService.listarProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerProducto(@PathVariable Long id) {
        try {
            logger.info("🔍 Buscando producto ID: {}", id);
            ProductosDTO producto = productosService.obtenerProducto(id);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            logger.error("❌ Producto no encontrado ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarProducto(@PathVariable Long id, @Valid @RequestBody ProductosDTO dto) {  // ✅ @Valid
        try {
            logger.info("✏️ Solicitud para actualizar producto ID: {}", id);
            ProductosDTO producto = productosService.actualizarProducto(id, dto);
            return ResponseEntity.ok(producto);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar producto: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        try {
            logger.info("🗑️ Solicitud para eliminar producto ID: {}", id);
            productosService.eliminarProducto(id);
            return ResponseEntity.ok("Producto eliminado exitosamente");
        } catch (Exception e) {
            logger.error("❌ Error al eliminar producto: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar-paginado")
    public ResponseEntity<Page<ProductosDTO>> listarProductosPaginados(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size,
        @RequestParam(defaultValue = "nombreProducto") String sortBy
    ) {
        logger.info("📋 Listando productos paginados");
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        Page<ProductosDTO> productos = productosService.listarProductosPaginados(pageable);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<ProductosDTO>> buscarProductos(
        @RequestParam(required = false) String categoria,
        @RequestParam(required = false) Double precioMin,
        @RequestParam(required = false) Double precioMax,
        @RequestParam(required = false) String nombre,
        @RequestParam(required = false) Boolean disponible,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "12") int size
    ) {
        logger.info("🔍 Buscando productos con filtros");
        Pageable pageable = PageRequest.of(page, size, Sort.by("nombreProducto").ascending());
        Page<ProductosDTO> productos = productosService.buscarProductos(
            categoria, precioMin, precioMax, nombre, disponible, pageable
        );
        return ResponseEntity.ok(productos);
    }
}
