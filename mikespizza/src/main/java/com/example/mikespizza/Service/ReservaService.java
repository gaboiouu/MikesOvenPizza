package com.example.mikespizza.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.ReservaFactory;
import com.example.mikespizza.Mapper.ReservaMapper;
import com.example.mikespizza.Model.Reserva;
import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.ReservaRepository;
import com.example.mikespizza.Repository.UserRepository;
import com.example.mikespizza.dto.ReservaDTO;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UserRepository userRepository;

    public ReservaDTO crearReserva(ReservaDTO reservaDTO) throws Exception {
        User usuario = userRepository.findById(reservaDTO.getUserId())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));
        Reserva reserva = ReservaFactory.crearReserva(
            usuario,
            reservaDTO.getNroPersonas(),
            reservaDTO.getFecha(),
            reservaDTO.getHora(),
            reservaDTO.getMensajeAdicional(),
            reservaDTO.getTelefono()
        );
        Reserva saved = reservaRepository.save(reserva);
        return ReservaMapper.toDTO(saved);
    }

    public List<ReservaDTO> listarReservas() {
        return reservaRepository.findAll()
                .stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<ReservaDTO> obtenerReservasPorUsuario(Long userId) {
        return reservaRepository.findByUsuarioId(userId)
                .stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ReservaDTO actualizarReserva(Long id, ReservaDTO reservaDTO) throws Exception {
        Reserva reserva = reservaRepository.findById(id)
            .orElseThrow(() -> new Exception("Reserva no encontrada"));
        User usuario = userRepository.findById(reservaDTO.getUserId())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));

        reserva.setUsuario(usuario);
        reserva.setNroPersonas(reservaDTO.getNroPersonas());
        reserva.setFecha(reservaDTO.getFecha());
        reserva.setHora(reservaDTO.getHora());
        reserva.setMensajeAdicional(reservaDTO.getMensajeAdicional());
        reserva.setTelefono(reservaDTO.getTelefono());

        Reserva updated = reservaRepository.save(reserva);
        return ReservaMapper.toDTO(updated);
    }

    public void eliminarReserva(Long id) {
        reservaRepository.deleteById(id);
    }
}
