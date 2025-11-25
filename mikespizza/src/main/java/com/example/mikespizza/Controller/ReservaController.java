package com.example.mikespizza.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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

    @PutMapping("/actualizar-reservas/{id}")
    public ReservaDTO actualizarReserva(@PathVariable Long id, @RequestBody ReservaDTO reservaDTO) throws Exception {
        return reservaService.actualizarReserva(id, reservaDTO);
    }

    @DeleteMapping("/eliminar-reservas/{id}")
    public void eliminarReserva(@PathVariable Long id) {
        reservaService.eliminarReserva(id);
    }
}
