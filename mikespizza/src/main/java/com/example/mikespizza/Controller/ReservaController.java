package com.example.mikespizza.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Service.ReservaService;
import com.example.mikespizza.dto.ReservaDTO;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PostMapping("/crear-reservas")
    public ReservaDTO crearReserva(@RequestBody ReservaDTO reservaDTO) throws Exception {
        return reservaService.crearReserva(reservaDTO);
    }

    @GetMapping("/listar-reservas")
    public List<ReservaDTO> listarReservas() {
        return reservaService.listarReservas();
    }

    @GetMapping("/mis-reservas/{userId}")
    public ResponseEntity<List<ReservaDTO>> getMisReservas(@PathVariable Long userId) {
        List<ReservaDTO> reservas = reservaService.obtenerReservasPorUsuario(userId);
        return ResponseEntity.ok(reservas);
    }

    @PutMapping("/actualizar-reservas/{id}")
    public ReservaDTO actualizarReserva(@PathVariable Long id, @RequestBody ReservaDTO reservaDTO) throws Exception {
        return reservaService.actualizarReserva(id, reservaDTO);
    }

    @DeleteMapping("/eliminar-reservas/{id}")
    public void eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
    }
}
