package com.example.mikespizza.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

import jakarta.transaction.Transactional;

@Service
public class IncidenciasAdminService {
    @Autowired
    private IncidenciasAdminRepository incidenciaRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Transactional
    public IncidenciasAdminDTO crearIncidencia(IncidenciasAdminDTO dto) throws Exception {
        User reportadoPor = userRepository.findById(dto.getReportadoPorId())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));
        
        User creadoPor = userRepository.findById(dto.getCreadoPorId())  
            .orElseThrow(() -> new Exception("Admin/Master no encontrado"));
        
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
        return IncidenciasAdminMapper.toDTO(saved);
    }
    
    public List<IncidenciasAdminDTO> listarTodas() {
        return incidenciaRepository.findAllByOrderByFechaCreacionDesc()
            .stream()
            .map(IncidenciasAdminMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public List<IncidenciasAdminDTO> listarPorEstado(EstadoIncidencia estado) {
        return incidenciaRepository.findByEstado(estado)
            .stream()
            .map(IncidenciasAdminMapper::toDTO)
            .collect(Collectors.toList());
    }
    
    public IncidenciasAdminDTO obtenerPorId(Long id) throws Exception {
        IncidenciasAdmin incidencia = incidenciaRepository.findById(id)
            .orElseThrow(() -> new Exception("Incidencia no encontrada"));
        return IncidenciasAdminMapper.toDTO(incidencia);
    }
    
    @Transactional
    public IncidenciasAdminDTO actualizarEstado(Long id, EstadoIncidencia nuevoEstado) throws Exception {
        IncidenciasAdmin incidencia = incidenciaRepository.findById(id)
            .orElseThrow(() -> new Exception("Incidencia no encontrada"));
        
        incidencia.setEstado(nuevoEstado);
        
        if (nuevoEstado == EstadoIncidencia.CERRADO) {
            incidencia.setFechaCierre(LocalDate.now());
        }
        
        IncidenciasAdmin updated = incidenciaRepository.save(incidencia);
        return IncidenciasAdminMapper.toDTO(updated);
    }
    
    @Transactional
    public IncidenciasAdminDTO actualizarIncidencia(Long id, IncidenciasAdminDTO dto) throws Exception {
        IncidenciasAdmin incidencia = incidenciaRepository.findById(id)
            .orElseThrow(() -> new Exception("Incidencia no encontrada"));
        
        // Actualizar campos
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
        return IncidenciasAdminMapper.toDTO(updated);
    }
    
    @Transactional
    public void eliminarIncidencia(Long id) {
        incidenciaRepository.deleteById(id);
    }
}
