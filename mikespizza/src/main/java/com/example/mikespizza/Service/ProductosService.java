package com.example.mikespizza.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.ProductosFactory;
import com.example.mikespizza.Mapper.ProductosMapper;
import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.Repository.ProductosRepository;
import com.example.mikespizza.dto.ProductosDTO;
import com.example.mikespizza.exception.ResourceNotFoundException;

@Service
public class ProductosService {

    private static final Logger logger = LoggerFactory.getLogger(ProductosService.class);

    @Autowired
    private ProductosRepository productosRepository;

    public ProductosDTO crearProducto(ProductosDTO dto) {
        logger.info("🍕 Creando producto: {}", dto.getNombre_producto());
        
        Producto producto;
        if (dto.getPrecio_grande() != null) {
            producto = ProductosFactory.creaProducto(
                dto.getNombre_producto(),
                dto.getCategoria(), 
                dto.getDescripcion(),
                dto.getIngredientes(),
                dto.getImagen_url(),
                dto.getPrecio_personal(),
                dto.getPrecio_grande()
            );
        } else {
            producto = ProductosFactory.creaProductoPersonal(
                dto.getNombre_producto(),
                dto.getCategoria(), 
                dto.getDescripcion(),
                dto.getIngredientes(),
                dto.getImagen_url(),
                dto.getPrecio_personal()
            );
        }
        
        Producto guardado = productosRepository.save(producto);
        logger.info("✅ Producto creado exitosamente ID: {} - {}", guardado.getProductoId(), guardado.getNombreProducto());
        
        return dto.getPrecio_grande() != null
            ? ProductosMapper.toDTO(guardado)
            : ProductosMapper.toPersonalDTO(guardado);
    }

    public List<ProductosDTO> listarProductos() {
        logger.info("📋 Listando todos los productos");
        
        List<ProductosDTO> productos = productosRepository.findAll()
            .stream()
            .map(p -> p.getPrecio_grande() != null
                ? ProductosMapper.toDTO(p)
                : ProductosMapper.toPersonalDTO(p))
            .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} productos", productos.size());
        return productos;
    }

    public Page<ProductosDTO> listarProductosPaginados(Pageable pageable) {
        logger.info("📋 Listando productos paginados - Página: {}, Tamaño: {}", 
            pageable.getPageNumber(), pageable.getPageSize());
        
        Page<ProductosDTO> productos = productosRepository.findAllByOrderByNombreProductoAsc(pageable)
            .map(ProductosMapper::toDTO);
        
        logger.info("✅ Página {}/{} - {} productos encontrados", 
            productos.getNumber() + 1, 
            productos.getTotalPages(), 
            productos.getNumberOfElements());
        
        return productos;
    }

    public ProductosDTO obtenerProducto(Long id) {
        logger.info("🔍 Buscando producto ID: {}", id);
        
        Producto producto = productosRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Producto no encontrado ID: {}", id);
                return new ResourceNotFoundException("Producto", "id", id);
            });
        
        logger.info("✅ Producto encontrado: {}", producto.getNombreProducto());
        return producto.getPrecio_grande() != null
            ? ProductosMapper.toDTO(producto)
            : ProductosMapper.toPersonalDTO(producto);
    }

    public ProductosDTO actualizarProducto(Long id, ProductosDTO dto) {
        logger.info("✏️ Actualizando producto ID: {}", id);
        
        Producto producto = productosRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Producto no encontrado ID: {}", id);
                return new ResourceNotFoundException("Producto", "id", id);
            });

        producto.setNombreProducto(dto.getNombre_producto());
        producto.setCategoria(dto.getCategoria()); 
        producto.setDescripcion(dto.getDescripcion());
        producto.setIngredientes(dto.getIngredientes());
        producto.setImagen_url(dto.getImagen_url());
        producto.setPrecio_personal(dto.getPrecio_personal());
        producto.setPrecio_grande(dto.getPrecio_grande());

        Producto actualizado = productosRepository.save(producto);
        logger.info("✅ Producto actualizado exitosamente ID: {} - {}", id, actualizado.getNombreProducto());
        
        return dto.getPrecio_grande() != null
            ? ProductosMapper.toDTO(actualizado)
            : ProductosMapper.toPersonalDTO(actualizado);
    }

    public void eliminarProducto(Long id) {
        logger.info("🗑️ Eliminando producto ID: {}", id);
        
        if (!productosRepository.existsById(id)) {
            logger.error("❌ Producto no encontrado ID: {}", id);
            throw new ResourceNotFoundException("Producto", "id", id);
        }
        
        productosRepository.deleteById(id);
        logger.info("✅ Producto eliminado exitosamente ID: {}", id);
    }

    public Page<ProductosDTO> buscarProductos(
        String categoria,
        Double precioMin,
        Double precioMax,
        String nombre,
        Boolean disponible,
        Pageable pageable
    ) {
        logger.info("🔍 Buscando productos - Categoría: {}, Precio: S/{}-{}, Nombre: {}", 
            categoria, precioMin, precioMax, nombre);
        
        Page<ProductosDTO> productos = productosRepository.buscarProductosConFiltros(
            categoria, precioMin, precioMax, nombre, pageable
        ).map(ProductosMapper::toDTO);
        
        logger.info("✅ Se encontraron {} productos", productos.getTotalElements());
        
        return productos;
    }
}
