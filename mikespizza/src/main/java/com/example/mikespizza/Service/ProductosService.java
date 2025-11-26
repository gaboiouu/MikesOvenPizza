package com.example.mikespizza.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.ProductosFactory;
import com.example.mikespizza.Mapper.ProductosMapper;
import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.Repository.ProductosRepository;
import com.example.mikespizza.dto.ProductosDTO;

@Service
public class ProductosService {

    @Autowired
    private ProductosRepository productosRepository;

    public ProductosDTO crearProducto(ProductosDTO dto) {
        Producto producto;
        if (dto.getPrecio_grande() != null) {
            producto = ProductosFactory.creaProducto(
                dto.getNombre_producto(),
                dto.getCategoria(), // CategoriaProducto enum
                dto.getDescripcion(),
                dto.getIngredientes(),
                dto.getImagen_url(),
                dto.getPrecio_personal(),
                dto.getPrecio_grande()
            );
        } else {
            producto = ProductosFactory.creaProductoPersonal(
                dto.getNombre_producto(),
                dto.getCategoria(), // CategoriaProducto enum
                dto.getDescripcion(),
                dto.getIngredientes(),
                dto.getImagen_url(),
                dto.getPrecio_personal()
            );
        }
        Producto guardado = productosRepository.save(producto);
        return dto.getPrecio_grande() != null
            ? ProductosMapper.toDTO(guardado)
            : ProductosMapper.toPersonalDTO(guardado);
    }

    public List<ProductosDTO> listarProductos() {
        return productosRepository.findAll()
            .stream()
            .map(p -> p.getPrecio_grande() != null
                ? ProductosMapper.toDTO(p)
                : ProductosMapper.toPersonalDTO(p))
            .collect(Collectors.toList());
    }

    public ProductosDTO obtenerProducto(Long id) throws Exception {
        Producto producto = productosRepository.findById(id)
            .orElseThrow(() -> new Exception("Producto no encontrado"));
        return producto.getPrecio_grande() != null
            ? ProductosMapper.toDTO(producto)
            : ProductosMapper.toPersonalDTO(producto);
    }

    public ProductosDTO actualizarProducto(Long id, ProductosDTO dto) throws Exception {
        Producto producto = productosRepository.findById(id)
            .orElseThrow(() -> new Exception("Producto no encontrado"));

        producto.setNombre_producto(dto.getNombre_producto());
        producto.setCategoria(dto.getCategoria()); // CategoriaProducto enum
        producto.setDescripcion(dto.getDescripcion());
        producto.setIngredientes(dto.getIngredientes());
        producto.setImagen_url(dto.getImagen_url());
        producto.setPrecio_personal(dto.getPrecio_personal());
        producto.setPrecio_grande(dto.getPrecio_grande());

        Producto actualizado = productosRepository.save(producto);
        return dto.getPrecio_grande() != null
            ? ProductosMapper.toDTO(actualizado)
            : ProductosMapper.toPersonalDTO(actualizado);
    }

    public void eliminarProducto(Long id) {
        productosRepository.deleteById(id);
    }
}
