package com.example.mikespizza.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.IncidenciasAdminFactory;
import com.example.mikespizza.Mapper.IncidenciasAdminMapper;
import com.example.mikespizza.Model.IncidenciasAdmin;
import com.example.mikespizza.Model.IncidenciasAdmin.EstadoIncidencia;
import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.IncidenciasAdminRepository;
import com.example.mikespizza.Repository.UserRepository;
import com.example.mikespizza.dto.IncidenciasAdminDTO;
import com.example.mikespizza.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class IncidenciasAdminService {
    
    private static final Logger logger = LoggerFactory.getLogger(IncidenciasAdminService.class);
    
    @Autowired
    private IncidenciasAdminRepository incidenciaRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public IncidenciasAdminDTO crearIncidencia(IncidenciasAdminDTO dto) {
        logger.info("🚨 Creando incidencia: {}", dto.getTitulo());
        
        User reportadoPor = userRepository.findById(dto.getReportadoPorId())
            .orElseThrow(() -> {
                logger.error("❌ Usuario reportador no encontrado ID: {}", dto.getReportadoPorId());
                return new ResourceNotFoundException("Usuario", "id", dto.getReportadoPorId());
            });
        
        User creadoPor = userRepository.findById(dto.getCreadoPorId())  
            .orElseThrow(() -> {
                logger.error("❌ Usuario creador no encontrado ID: {}", dto.getCreadoPorId());
                return new ResourceNotFoundException("Usuario", "id", dto.getCreadoPorId());
            });
        
        IncidenciasAdmin incidencia = IncidenciasAdminFactory.crearIncidencia(
            reportadoPor,
            creadoPor,  
            dto.getTipo(),
            dto.getTitulo(),
            dto.getDescripcion(),
            dto.getPrioridad(),
            dto.getResponsable()
        );
        
        IncidenciasAdmin saved = incidenciaRepository.save(incidencia);
        logger.info("✅ Incidencia creada exitosamente ID: {} - Prioridad: {}", saved.getId(), saved.getPrioridad());
        
        return IncidenciasAdminMapper.toDTO(saved);
    }
    
    public List<IncidenciasAdminDTO> listarTodas() {
        logger.info("📋 Listando todas las incidencias");
        
        List<IncidenciasAdminDTO> incidencias = incidenciaRepository.findAllByOrderByFechaCreacionDesc()
            .stream()
            .map(IncidenciasAdminMapper::toDTO)
            .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} incidencias", incidencias.size());
        return incidencias;
    }
    
    public List<IncidenciasAdminDTO> listarPorEstado(EstadoIncidencia estado) {
        logger.info("🔍 Buscando incidencias con estado: {}", estado);
        
        List<IncidenciasAdminDTO> incidencias = incidenciaRepository.findByEstado(estado)
            .stream()
            .map(IncidenciasAdminMapper::toDTO)
            .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} incidencias con estado: {}", incidencias.size(), estado);
        return incidencias;
    }
    
    public IncidenciasAdminDTO obtenerPorId(Long id) {
        logger.info("🔍 Buscando incidencia ID: {}", id);
        
        IncidenciasAdmin incidencia = incidenciaRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Incidencia no encontrada ID: {}", id);
                return new ResourceNotFoundException("Incidencia", "id", id);
            });
        
        logger.info("✅ Incidencia encontrada: {}", incidencia.getTitulo());
        return IncidenciasAdminMapper.toDTO(incidencia);
    }
    
    @Transactional
    public IncidenciasAdminDTO actualizarEstado(Long id, EstadoIncidencia nuevoEstado) {
        logger.info("✏️ Actualizando estado de incidencia ID: {} a {}", id, nuevoEstado);
        
        IncidenciasAdmin incidencia = incidenciaRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Incidencia no encontrada ID: {}", id);
                return new ResourceNotFoundException("Incidencia", "id", id);
            });
        
        incidencia.setEstado(nuevoEstado);
        
        if (nuevoEstado == EstadoIncidencia.CERRADO) {
            incidencia.setFechaCierre(LocalDate.now());
            logger.info("🔒 Incidencia cerrada ID: {}", id);
        }
        
        IncidenciasAdmin updated = incidenciaRepository.save(incidencia);
        logger.info("✅ Estado actualizado exitosamente ID: {}", id);
        
        return IncidenciasAdminMapper.toDTO(updated);
    }
    
    @Transactional
    public IncidenciasAdminDTO actualizarIncidencia(Long id, IncidenciasAdminDTO dto) {
        logger.info("✏️ Actualizando incidencia ID: {}", id);
        
        IncidenciasAdmin incidencia = incidenciaRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Incidencia no encontrada ID: {}", id);
                return new ResourceNotFoundException("Incidencia", "id", id);
            });
        
        if (dto.getTitulo() != null) {
            incidencia.setTitulo(dto.getTitulo());
        }
        if (dto.getDescripcion() != null) {
            incidencia.setDescripcion(dto.getDescripcion());
        }
        if (dto.getPrioridad() != null) {
            incidencia.setPrioridad(dto.getPrioridad());
        }
        if (dto.getResponsable() != null) {
            incidencia.setResponsable(dto.getResponsable());
        }
        if (dto.getEstado() != null) {
            incidencia.setEstado(dto.getEstado());
            
            if (dto.getEstado() == EstadoIncidencia.CERRADO && incidencia.getFechaCierre() == null) {
                incidencia.setFechaCierre(LocalDate.now());
            }
        }
        
        IncidenciasAdmin updated = incidenciaRepository.save(incidencia);
        logger.info("✅ Incidencia actualizada exitosamente ID: {}", id);
        
        return IncidenciasAdminMapper.toDTO(updated);
    }
    
    @Transactional
    public void eliminarIncidencia(Long id) {
        logger.info("🗑️ Eliminando incidencia ID: {}", id);
        
        if (!incidenciaRepository.existsById(id)) {
            logger.error("❌ Incidencia no encontrada ID: {}", id);
            throw new ResourceNotFoundException("Incidencia", "id", id);
        }
        
        incidenciaRepository.deleteById(id);
        logger.info("✅ Incidencia eliminada exitosamente ID: {}", id);
    }
}
