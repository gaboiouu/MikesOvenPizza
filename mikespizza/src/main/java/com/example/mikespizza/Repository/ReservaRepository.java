package com.example.mikespizza.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.mikespizza.Model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {
}
