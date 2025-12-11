package com.example.mikespizza.Controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Service.ReporteService;

@RestController
@RequestMapping("/reportes")
public class ReporteController {
    
    private static final Logger logger = LoggerFactory.getLogger(ReporteController.class);
    
    @Autowired
    private ReporteService reporteService;

    @GetMapping("/ventas-del-dia")
    public ResponseEntity<?> ventasDelDia() {
        logger.info("📊 Solicitando ventas del día");
        Map<String, Object> reporte = reporteService.obtenerVentasDelDia();
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/ventas-por-periodo")
    public ResponseEntity<?> ventasPorPeriodo(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin
    ) {
        logger.info("📊 Solicitando ventas del {} al {}", fechaInicio, fechaFin);
        Map<String, Object> reporte = reporteService.obtenerVentasPorPeriodo(fechaInicio, fechaFin);
        return ResponseEntity.ok(reporte);
    }

    @GetMapping("/productos-mas-vendidos")
    public ResponseEntity<?> productosMasVendidos(
        @RequestParam(defaultValue = "3") int limit
    ) {
        logger.info("🍕 Solicitando top {} productos más vendidos", limit);
        List<Map<String, Object>> productos = reporteService.obtenerProductosMasVendidos(limit);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/clientes-frecuentes")
    public ResponseEntity<?> clientesFrecuentes(
        @RequestParam(defaultValue = "10") int limit
    ) {
        logger.info("👥 Solicitando top {} clientes frecuentes", limit);
        List<Map<String, Object>> clientes = reporteService.obtenerClientesFrecuentes(limit);
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/resumen-dashboard")
    public ResponseEntity<?> resumenDashboard() {
        logger.info("📊 Solicitando resumen general del dashboard");
        Map<String, Object> resumen = reporteService.obtenerResumenDashboard();
        return ResponseEntity.ok(resumen);
    }
}