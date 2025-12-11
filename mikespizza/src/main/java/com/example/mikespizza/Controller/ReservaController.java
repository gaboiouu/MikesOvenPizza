package com.example.mikespizza.Controller;

import java.time.LocalDate;
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

import com.example.mikespizza.Service.ReservaService;
import com.example.mikespizza.dto.ReservaDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reservas")
@Validated
public class ReservaController {

    private static final Logger logger = LoggerFactory.getLogger(ReservaController.class);

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/crear-reservas")
    public ResponseEntity<?> crearReserva(@Valid @RequestBody ReservaDTO reservaDTO) {  // ✅ @Valid
        try {
            logger.info("📅 Solicitud para crear reserva - Usuario ID: {}", reservaDTO.getUserId());
            ReservaDTO reserva = reservaService.crearReserva(reservaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
        } catch (Exception e) {
            logger.error("❌ Error al crear reserva: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar-reservas")
    public ResponseEntity<List<ReservaDTO>> listarReservas() {
        logger.info("📋 Listando todas las reservas");
        List<ReservaDTO> reservas = reservaService.listarReservas();
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/mis-reservas/{userId}")
    public ResponseEntity<List<ReservaDTO>> getMisReservas(@PathVariable Long userId) {
        logger.info("📋 Listando reservas del usuario ID: {}", userId);
        List<ReservaDTO> reservas = reservaService.obtenerReservasPorUsuario(userId);
        return ResponseEntity.ok(reservas);
    }

    @PutMapping("/actualizar-reservas/{id}")
    public ResponseEntity<?> actualizarReserva(@PathVariable Long id, @Valid @RequestBody ReservaDTO reservaDTO) {  // ✅ @Valid
        try {
            logger.info("✏️ Actualizando reserva ID: {}", id);
            ReservaDTO reserva = reservaService.actualizarReserva(id, reservaDTO);
            return ResponseEntity.ok(reserva);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar reserva: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/eliminar-reservas/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Long id) {
        try {
            logger.info("🗑️ Eliminando reserva ID: {}", id);
            reservaService.eliminarReserva(id);
            return ResponseEntity.ok("Reserva eliminada exitosamente");
        } catch (Exception e) {
            logger.error("❌ Error al eliminar reserva: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar-paginado")
    public ResponseEntity<Page<ReservaDTO>> listarReservasPaginadas(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        logger.info("📋 Listando reservas paginadas");
        Pageable pageable = PageRequest.of(page, size, Sort.by("fecha").descending());
        Page<ReservaDTO> reservas = reservaService.listarReservasPaginadas(pageable);
        return ResponseEntity.ok(reservas);
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<ReservaDTO>> buscarReservas(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
        @RequestParam(required = false) Long userId,
        @RequestParam(required = false) Integer nroPersonas,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        logger.info("🔍 Buscando reservas con filtros");
        Pageable pageable = PageRequest.of(page, size, Sort.by("fecha").descending());
        Page<ReservaDTO> reservas = reservaService.buscarReservas(fecha, userId, nroPersonas, pageable);
        return ResponseEntity.ok(reservas);
    }
}
