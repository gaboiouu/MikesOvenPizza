package com.example.mikespizza.Factory;

import java.time.LocalDate;

import com.example.mikespizza.Model.Reserva;
import com.example.mikespizza.Model.User;

public class ReservaFactory {
    public static Reserva crearReserva(User usuario, int nroPersonas, LocalDate fecha, String hora, String mensajeAdicional, String telefono) {
        return new Reserva(usuario, nroPersonas, fecha, hora, mensajeAdicional, telefono);
    }
}
