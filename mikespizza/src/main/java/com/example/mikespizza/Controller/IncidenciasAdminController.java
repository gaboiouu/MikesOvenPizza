package com.example.mikespizza.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.example.mikespizza.Model.IncidenciasAdmin.EstadoIncidencia;
import com.example.mikespizza.Service.IncidenciasAdminService;
import com.example.mikespizza.dto.IncidenciasAdminDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/incidencias-admin")
@Validated
public class IncidenciasAdminController {
    
    private static final Logger logger = LoggerFactory.getLogger(IncidenciasAdminController.class);
    
    @Autowired
    private IncidenciasAdminService incidenciaService;

    @PostMapping("/crear")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> crearIncidencia(@Valid @RequestBody IncidenciasAdminDTO dto) {  // ✅ @Valid
        try {
            logger.info("🚨 Solicitud para crear incidencia: {}", dto.getTitulo());
            IncidenciasAdminDTO creada = incidenciaService.crearIncidencia(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (Exception e) {
            logger.error("❌ Error al crear incidencia: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<List<IncidenciasAdminDTO>> listarTodas() {
        logger.info("📋 Listando todas las incidencias");
        List<IncidenciasAdminDTO> incidencias = incidenciaService.listarTodas();
        return ResponseEntity.ok(incidencias);
    }

    @GetMapping("/listar/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<List<IncidenciasAdminDTO>> listarPorEstado(@RequestParam EstadoIncidencia estado) {
        logger.info("🔍 Listando incidencias con estado: {}", estado);
        List<IncidenciasAdminDTO> incidencias = incidenciaService.listarPorEstado(estado);
        return ResponseEntity.ok(incidencias);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            logger.info("🔍 Buscando incidencia ID: {}", id);
            IncidenciasAdminDTO incidencia = incidenciaService.obtenerPorId(id);
            return ResponseEntity.ok(incidencia);
        } catch (Exception e) {
            logger.error("❌ Incidencia no encontrada ID: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestParam EstadoIncidencia estado) {
        try {
            logger.info("✏️ Actualizando estado de incidencia ID: {} a {}", id, estado);
            IncidenciasAdminDTO actualizada = incidenciaService.actualizarEstado(id, estado);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar estado: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> actualizarIncidencia(@PathVariable Long id, @Valid @RequestBody IncidenciasAdminDTO dto) {  // ✅ @Valid
        try {
            logger.info("✏️ Actualizando incidencia ID: {}", id);
            IncidenciasAdminDTO actualizada = incidenciaService.actualizarIncidencia(id, dto);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            logger.error("❌ Error al actualizar incidencia: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<?> eliminarIncidencia(@PathVariable Long id) {
        try {
            logger.info("🗑️ Eliminando incidencia ID: {}", id);
            incidenciaService.eliminarIncidencia(id);
            return ResponseEntity.ok("Incidencia eliminada exitosamente");
        } catch (Exception e) {
            logger.error("❌ Error al eliminar incidencia: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
