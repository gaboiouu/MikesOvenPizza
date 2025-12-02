package com.example.mikespizza.Mapper;

import com.example.mikespizza.Model.IncidenciasAdmin;
import com.example.mikespizza.dto.IncidenciasAdminDTO;

public class IncidenciasAdminMapper {
    public static IncidenciasAdminDTO toDTO(IncidenciasAdmin incidencia) {
        return new IncidenciasAdminDTO(
            incidencia.getId(),                                    
            incidencia.getTipo(),                                  
            incidencia.getTitulo(),                                
            incidencia.getDescripcion(),                           
            incidencia.getEstado(),                                
            incidencia.getPrioridad(),                             
            incidencia.getResponsable(),                           
            incidencia.getReportadoPor().getId(),                  
            incidencia.getReportadoPor().getNombreCompleto(),      
            incidencia.getCreadoPor().getId(),                     
            incidencia.getCreadoPor().getNombreCompleto(),        
            incidencia.getFechaCreacion(),                         
            incidencia.getFechaCierre()                            
        );
    }
}