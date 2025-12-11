package com.example.mikespizza.Mapper;

import com.example.mikespizza.Model.Reserva;
import com.example.mikespizza.dto.ReservaDTO;

public class ReservaMapper {
    public static ReservaDTO toDTO(Reserva reserva) {
        ReservaDTO.UsuarioReservaDTO usuarioDTO = null;
        if (reserva.getUsuario() != null) {
            usuarioDTO = new ReservaDTO.UsuarioReservaDTO(
                reserva.getUsuario().getId(),
                reserva.getUsuario().getNombreCompleto(),
                reserva.getUsuario().getEmail(),
                null
            );
        }

        return new ReservaDTO(
            reserva.getId(),
            reserva.getUsuario().getId(),
            reserva.getNroPersonas(),
            reserva.getFecha(),
            reserva.getHora(),
            reserva.getMensajeAdicional(),
            reserva.getTelefono(),
            usuarioDTO  
        );
    }
}