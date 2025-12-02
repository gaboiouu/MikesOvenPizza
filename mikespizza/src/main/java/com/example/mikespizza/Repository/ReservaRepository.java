package com.example.mikespizza.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mikespizza.Model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long userId);
}
