package com.example.mikespizza.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

@RestController
@RequestMapping("/incidencias-admin")
public class IncidenciasAdminController {
    @Autowired
    private IncidenciasAdminService incidenciaService;

    @PostMapping("/crear")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> crearIncidencia(@RequestBody IncidenciasAdminDTO dto) {
        try {
            IncidenciasAdminDTO creada = incidenciaService.crearIncidencia(dto);
            return ResponseEntity.ok(creada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/listar")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<List<IncidenciasAdminDTO>> listarTodas() {
        List<IncidenciasAdminDTO> incidencias = incidenciaService.listarTodas();
        return ResponseEntity.ok(incidencias);
    }

    @GetMapping("/listar/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<List<IncidenciasAdminDTO>> listarPorEstado(
            @RequestParam EstadoIncidencia estado) {
        List<IncidenciasAdminDTO> incidencias = incidenciaService.listarPorEstado(estado);
        return ResponseEntity.ok(incidencias);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            IncidenciasAdminDTO incidencia = incidenciaService.obtenerPorId(id);
            return ResponseEntity.ok(incidencia);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> actualizarEstado(
            @PathVariable Long id,
            @RequestParam EstadoIncidencia estado) {
        try {
            IncidenciasAdminDTO actualizada = incidenciaService.actualizarEstado(id, estado);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MASTER')")
    public ResponseEntity<?> actualizarIncidencia(
            @PathVariable Long id,
            @RequestBody IncidenciasAdminDTO dto) {
        try {
            IncidenciasAdminDTO actualizada = incidenciaService.actualizarIncidencia(id, dto);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MASTER')")
    public ResponseEntity<?> eliminarIncidencia(@PathVariable Long id) {
        try {
            incidenciaService.eliminarIncidencia(id);
            return ResponseEntity.ok("Incidencia eliminada exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
