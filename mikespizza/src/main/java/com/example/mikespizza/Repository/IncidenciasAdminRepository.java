package com.example.mikespizza.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mikespizza.Model.IncidenciasAdmin;
import com.example.mikespizza.Model.IncidenciasAdmin.EstadoIncidencia;
import com.example.mikespizza.Model.IncidenciasAdmin.TipoIncidencia;

public interface IncidenciasAdminRepository extends JpaRepository<IncidenciasAdmin, Long> {
    List<IncidenciasAdmin> findByEstado(EstadoIncidencia estado);    
    List<IncidenciasAdmin> findByTipo(TipoIncidencia tipo);
    List<IncidenciasAdmin> findByReportadoPor_Id(Long userId);
    List<IncidenciasAdmin> findByResponsable(String responsable);
    List<IncidenciasAdmin> findByEstadoAndTipo(EstadoIncidencia estado, TipoIncidencia tipo);
    List<IncidenciasAdmin> findAllByOrderByFechaCreacionDesc();
}
