package com.example.mikespizza.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Model.Pedido.EstadoPedido;
import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.Model.Reserva;
import com.example.mikespizza.Repository.PedidoRepository;
import com.example.mikespizza.Repository.ProductosRepository;
import com.example.mikespizza.Repository.ReservaRepository;
import com.example.mikespizza.Repository.UserRepository;

@Service
public class ReporteService {
    
    private static final Logger logger = LoggerFactory.getLogger(ReporteService.class);
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private ProductosRepository productosRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReservaRepository reservaRepository;

    public Map<String, Object> obtenerVentasDelDia() {
        LocalDate hoy = LocalDate.now();
        LocalDateTime inicioDia = hoy.atStartOfDay();
        LocalDateTime finDia = hoy.atTime(23, 59, 59);
        
        logger.info("📊 Calculando ventas del día: {}", hoy);
        
        Double totalVentas = pedidoRepository.calcularVentasPorFecha(inicioDia);
        Long cantidadPedidos = pedidoRepository.contarPedidosPorFecha(inicioDia);
        
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("fecha", hoy);
        reporte.put("totalVentas", totalVentas != null ? totalVentas : 0.0);
        reporte.put("cantidadPedidos", cantidadPedidos != null ? cantidadPedidos : 0);
        reporte.put("promedioVenta", cantidadPedidos > 0 ? totalVentas / cantidadPedidos : 0.0);
        
        logger.info("✅ Ventas del día: S/{} en {} pedidos", totalVentas, cantidadPedidos);
        
        return reporte;
    }

    public Map<String, Object> obtenerVentasPorPeriodo(LocalDate fechaInicio, LocalDate fechaFin) {
        LocalDateTime inicio = fechaInicio.atStartOfDay();
        LocalDateTime fin = fechaFin.atTime(23, 59, 59);
        
        logger.info("📊 Calculando ventas del {} al {}", fechaInicio, fechaFin);
        
        List<Object[]> ventasPorDia = pedidoRepository.obtenerVentasPorDia(inicio, fin);
        
        Map<String, Object> reporte = new HashMap<>();
        reporte.put("fechaInicio", fechaInicio);
        reporte.put("fechaFin", fechaFin);
        reporte.put("ventasPorDia", ventasPorDia);
        
        Double totalPeriodo = ventasPorDia.stream()
            .mapToDouble(v -> ((Number) v[1]).doubleValue())
            .sum();
        
        Long pedidosPeriodo = ventasPorDia.stream()
            .mapToLong(v -> ((Number) v[2]).longValue())
            .sum();
        
        reporte.put("totalVentas", totalPeriodo);
        reporte.put("totalPedidos", pedidosPeriodo);
        
        logger.info("✅ Ventas del periodo: S/{} en {} pedidos", totalPeriodo, pedidosPeriodo);
        
        return reporte;
    }

    public List<Map<String, Object>> obtenerProductosMasVendidos(int limit) {
        logger.info("🍕 Obteniendo top {} productos más vendidos", limit);
        
        List<Object[]> productos = pedidoRepository.obtenerProductosMasVendidos(limit);
        
        return productos.stream()
            .limit(limit)  
            .map(p -> {
                Map<String, Object> producto = new HashMap<>();
                
                Long productoId = ((Number) p[0]).longValue();
                
                Producto productoCompleto = productosRepository.findById(productoId).orElse(null);
                
                producto.put("productoId", productoId);
                producto.put("nombreProducto", p[1]);
                producto.put("cantidadVendida", p[2]);
                producto.put("totalVentas", p[3]);
                
                if (productoCompleto != null) {
                    producto.put("ingredientes", productoCompleto.getIngredientes());
                    producto.put("precioPersonal", productoCompleto.getPrecio_personal());
                    producto.put("precioGrande", productoCompleto.getPrecio_grande());
                    producto.put("imagenUrl", productoCompleto.getImagen_url());
                    producto.put("categoria", productoCompleto.getCategoria());
                } else {
                    producto.put("ingredientes", "");
                    producto.put("precioPersonal", 0.0);
                    producto.put("precioGrande", 0.0);
                    producto.put("imagenUrl", "");
                    producto.put("categoria", "");
                }
                
                logger.debug("📦 Producto completo: {} - Imagen: {}", 
                    producto.get("nombreProducto"), 
                    producto.get("imagenUrl"));
                
                return producto;
            }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> obtenerClientesFrecuentes(int limit) {
        logger.info("👥 Obteniendo top {} clientes frecuentes", limit);
        
        List<Object[]> clientes = pedidoRepository.obtenerClientesFrecuentes(limit);
        
        return clientes.stream().map(c -> {
            Map<String, Object> cliente = new HashMap<>();
            cliente.put("userId", c[0]);
            cliente.put("nombreCompleto", c[1]);
            cliente.put("email", c[2]);
            cliente.put("cantidadPedidos", c[3]);
            cliente.put("totalGastado", c[4]);
            return cliente;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> obtenerResumenDashboard() {
        logger.info("📊 Generando resumen del dashboard");
        
        Map<String, Object> resumen = new HashMap<>();
        
        resumen.put("ventasHoy", obtenerVentasDelDia());
        
        Long totalUsuarios = userRepository.count();
        resumen.put("totalUsuarios", totalUsuarios);
        
        Long totalProductos = productosRepository.count();
        resumen.put("totalProductos", totalProductos);
        
        Long pedidosPendientes = pedidoRepository.countByEstado(EstadoPedido.PENDIENTE);
        resumen.put("pedidosPendientes", pedidosPendientes);
        
        List<Reserva> reservasHoy = reservaRepository.findByFecha(LocalDate.now());
        resumen.put("reservasHoy", reservasHoy.size());
        
        logger.info("✅ Resumen generado exitosamente");
        
        return resumen;
    }
}