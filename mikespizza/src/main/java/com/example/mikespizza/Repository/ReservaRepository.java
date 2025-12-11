package com.example.mikespizza.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.mikespizza.Model.Reserva;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    List<Reserva> findByUsuarioId(Long userId);
    
    Page<Reserva> findAllByOrderByFechaDesc(Pageable pageable);
    
    @Query("SELECT r FROM Reserva r WHERE " +
           "(:fecha IS NULL OR r.fecha = :fecha) AND " +
           "(:userId IS NULL OR r.usuario.id = :userId) AND " +
           "(:nroPersonas IS NULL OR r.nroPersonas = :nroPersonas) " +
           "ORDER BY r.fecha DESC, r.hora DESC")
    Page<Reserva> buscarReservasConFiltros(
        @Param("fecha") LocalDate fecha,
        @Param("userId") Long userId,
        @Param("nroPersonas") Integer nroPersonas,
        Pageable pageable
    );
    
    @Query("SELECT COALESCE(SUM(r.nroPersonas), 0) FROM Reserva r WHERE r.fecha = :fecha AND r.hora = :hora")
    Integer contarPersonasPorFechaYHora(@Param("fecha") LocalDate fecha, @Param("hora") String hora);
    
    List<Reserva> findByFecha(LocalDate fecha);
}
