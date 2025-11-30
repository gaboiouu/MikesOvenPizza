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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.Model.Pedido.EstadoPedido;
import com.example.mikespizza.Service.PedidoService;
import com.example.mikespizza.dto.PedidoDTO;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    @PostMapping("/crear")
    public PedidoDTO crearPedido(@RequestBody PedidoDTO pedidoDTO) throws Exception {
        return pedidoService.crearPedido(pedidoDTO);
    }

    @GetMapping("/usuario/{userId}")
    public List<PedidoDTO> listarPedidosPorUsuario(@PathVariable Long userId) {
        return pedidoService.listarPedidosPorUsuario(userId);
    }

    @GetMapping("/mis-pedidos/{userId}")
    public ResponseEntity<List<Pedido>> getPedidosPorUsuario(@PathVariable Long userId) {
        List<Pedido> pedidos = pedidoService.getPedidosPorUsuario(userId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/listar")
    public List<PedidoDTO> listarTodosPedidos() {
        return pedidoService.listarTodosPedidos();
    }

    @GetMapping("/{pedidoId}")
    public PedidoDTO obtenerPedido(@PathVariable Long pedidoId) throws Exception {
        return pedidoService.obtenerPedido(pedidoId);
    }

    @PutMapping("/{pedidoId}/estado")
    public PedidoDTO actualizarEstado(
        @PathVariable Long pedidoId,
        @RequestParam EstadoPedido nuevoEstado
    ) throws Exception {
        return pedidoService.actualizarEstado(pedidoId, nuevoEstado);
    }

    @DeleteMapping("/{pedidoId}")
    public void eliminarPedido(@PathVariable Long pedidoId) {
        pedidoService.eliminarPedido(pedidoId);
    }
}
