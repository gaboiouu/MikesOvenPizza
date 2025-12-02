package com.example.mikespizza.Factory;

import com.example.mikespizza.Model.IncidenciasAdmin;
import com.example.mikespizza.Model.IncidenciasAdmin.EstadoIncidencia;
import com.example.mikespizza.Model.IncidenciasAdmin.PrioridadIncidencia;
import com.example.mikespizza.Model.IncidenciasAdmin.TipoIncidencia;
import com.example.mikespizza.Model.User;

public class IncidenciasAdminFactory {
    public static IncidenciasAdmin crearIncidencia(
            User reportadoPor,
            User creadoPor,  
            TipoIncidencia tipo, 
            String titulo, 
            String descripcion, 
            PrioridadIncidencia prioridad, 
            String responsable) {
        IncidenciasAdmin incidencia = new IncidenciasAdmin(reportadoPor, tipo, titulo, descripcion, prioridad, responsable);
        incidencia.setCreadoPor(creadoPor);  
        return incidencia;
    }
    
    public static IncidenciasAdmin crearIncidenciaAbierta(
            User reportadoPor,
            User creadoPor, 
            TipoIncidencia tipo, 
            String titulo, 
            String descripcion, 
            PrioridadIncidencia prioridad) {
        IncidenciasAdmin incidencia = new IncidenciasAdmin(
            reportadoPor, tipo, titulo, descripcion, prioridad, null
        );
        incidencia.setEstado(EstadoIncidencia.ABIERTO);
        incidencia.setCreadoPor(creadoPor); 
        return incidencia;
    }
}
