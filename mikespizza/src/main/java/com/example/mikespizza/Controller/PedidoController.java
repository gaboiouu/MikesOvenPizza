package com.example.mikespizza.Controller;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.example.mikespizza.Model.Pedido.EstadoPedido;
import com.example.mikespizza.Service.PedidoService;
import com.example.mikespizza.dto.PedidoDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/pedidos")
@Validated
public class PedidoController {
    
    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    
    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/crear")
    public ResponseEntity<?> crearPedido(@Valid @RequestBody PedidoDTO pedidoDTO) {
        try {
            logger.info("🛒 Solicitud para crear pedido - Usuario ID: {}", pedidoDTO.getUserId());
            PedidoDTO pedido = pedidoService.crearPedido(pedidoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(pedido);
        } catch (Exception e) {
            logger.error("❌ Error al crear pedido: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/usuario/{userId}")
    public ResponseEntity<List<PedidoDTO>> listarPedidosPorUsuario(@PathVariable Long userId) {
        logger.info("📋 Listando pedidos del usuario ID: {}", userId);
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPorUsuario(userId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/listar")
    public ResponseEntity<List<PedidoDTO>> listarTodosPedidos() {
        logger.info("📋 Listando todos los pedidos (sin paginación)");
        List<PedidoDTO> pedidos = pedidoService.listarTodosPedidos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{pedidoId}")
    public ResponseEntity<?> obtenerPedido(@PathVariable Long pedidoId) {
        try {
            logger.info("🔍 Buscando pedido ID: {}", pedidoId);
            PedidoDTO pedido = pedidoService.obtenerPedido(pedidoId);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            logger.error("❌ Pedido no encontrado ID: {}", pedidoId);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{pedidoId}/estado")
    public ResponseEntity<?> actualizarEstado(
        @PathVariable Long pedidoId,
        @RequestParam EstadoPedido nuevoEstado
    ) {
        try {
            logger.info("✏️ Actualizando estado del pedido ID: {} a {}", pedidoId, nuevoEstado);
            PedidoDTO pedido = pedidoService.actualizarEstado(pedidoId, nuevoEstado);
            return ResponseEntity.ok(pedido);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar estado: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{pedidoId}")
    public ResponseEntity<?> eliminarPedido(@PathVariable Long pedidoId) {
        try {
            logger.info("🗑️ Eliminando pedido ID: {}", pedidoId);
            pedidoService.eliminarPedido(pedidoId);
            return ResponseEntity.ok("Pedido eliminado exitosamente");
        } catch (Exception e) {
            logger.error("❌ Error al eliminar pedido: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar-paginado")
    public ResponseEntity<Page<PedidoDTO>> listarPedidosPaginados(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "fechaPedido") String sortBy,
        @RequestParam(defaultValue = "DESC") String direction
    ) {
        logger.info("📋 Listando pedidos paginados - Página: {}, Tamaño: {}", page, size);
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("ASC") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<PedidoDTO> pedidos = pedidoService.listarPedidosPaginados(pageable);
        
        logger.info("✅ Página {}/{} - {} pedidos", 
            pedidos.getNumber() + 1, 
            pedidos.getTotalPages(), 
            pedidos.getNumberOfElements());
        
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<PedidoDTO>> buscarPedidos(
        @RequestParam(required = false) EstadoPedido estado,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
        @RequestParam(required = false) Long userId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        logger.info("🔍 Buscando pedidos - Estado: {}, Usuario: {}, Rango: {} a {}", 
            estado, userId, fechaInicio, fechaFin);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPedido"));
        Page<PedidoDTO> pedidos = pedidoService.buscarPedidos(estado, fechaInicio, fechaFin, userId, pageable);
        
        logger.info("✅ Se encontraron {} pedidos que coinciden con los filtros", 
            pedidos.getTotalElements());
        
        return ResponseEntity.ok(pedidos);
    }
}
