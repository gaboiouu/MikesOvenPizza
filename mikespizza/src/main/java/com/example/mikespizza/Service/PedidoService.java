package com.example.mikespizza.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.DetallePedidoFactory;
import com.example.mikespizza.Factory.PedidoFactory;
import com.example.mikespizza.Mapper.PedidoMapper;
import com.example.mikespizza.Model.DetallePedido;
import com.example.mikespizza.Model.Pedido;
import com.example.mikespizza.Model.Pedido.EstadoPedido;
import com.example.mikespizza.Model.Producto;
import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.PedidoRepository;
import com.example.mikespizza.Repository.ProductosRepository;
import com.example.mikespizza.Repository.UserRepository;
import com.example.mikespizza.dto.DetallePedidoDTO;
import com.example.mikespizza.dto.PedidoDTO;

import jakarta.transaction.Transactional;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductosRepository productosRepository;

    @Transactional
    public PedidoDTO crearPedido(PedidoDTO pedidoDTO) throws Exception {
        User usuario = userRepository.findById(pedidoDTO.getUserId())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));

        Pedido pedido = PedidoFactory.crearPedidoPendiente(
            usuario,
            pedidoDTO.getTotal(),
            pedidoDTO.getDireccionEntrega(),
            pedidoDTO.getTelefonoContacto(),
            pedidoDTO.getNotas()
        );

        pedido = pedidoRepository.save(pedido);

        for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetalles()) {
            Producto producto = productosRepository.findById(detalleDTO.getProductoId())
                .orElseThrow(() -> new Exception("Producto no encontrado: " + detalleDTO.getProductoId()));

            DetallePedido detalle = DetallePedidoFactory.crearDetalle(
                pedido,
                producto,
                detalleDTO.getCantidad(),
                detalleDTO.getPrecioUnitario(),
                detalleDTO.getTamanio()
            );

            pedido.getDetalles().add(detalle);
        }

        Pedido pedidoGuardado = pedidoRepository.save(pedido);
        return PedidoMapper.toDTO(pedidoGuardado);
    }

    public List<PedidoDTO> listarPedidosPorUsuario(Long userId) {
        return pedidoRepository.findByUsuario_IdOrderByFechaPedidoDesc(userId)
                .stream()
                .map(PedidoMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<Pedido> getPedidosPorUsuario(Long userId) {
        return pedidoRepository.findByUsuario_Id(userId);
    }
    public List<PedidoDTO> listarTodosPedidos() {
        return pedidoRepository.findAll()
            .stream()
            .map(PedidoMapper::toDTO)
            .collect(Collectors.toList());
    }

    public PedidoDTO obtenerPedido(Long pedidoId) throws Exception {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new Exception("Pedido no encontrado"));
        return PedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoDTO actualizarEstado(Long pedidoId, EstadoPedido nuevoEstado) throws Exception {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new Exception("Pedido no encontrado"));
        
        pedido.setEstado(nuevoEstado);
        Pedido pedidoActualizado = pedidoRepository.save(pedido);
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    public void eliminarPedido(Long pedidoId) {
        pedidoRepository.deleteById(pedidoId);
    }
}
