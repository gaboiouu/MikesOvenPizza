package com.example.mikespizza.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import com.example.mikespizza.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;

@Service
public class PedidoService {
    
    private static final Logger logger = LoggerFactory.getLogger(PedidoService.class);
    
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductosRepository productosRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public PedidoDTO crearPedido(PedidoDTO pedidoDTO) {
        logger.info("🛒 Creando pedido para usuario ID: {}", pedidoDTO.getUserId());
        logger.debug("📦 Total del pedido: S/{} - {} productos", pedidoDTO.getTotal(), pedidoDTO.getDetalles().size());
        
        User usuario = userRepository.findById(pedidoDTO.getUserId())
            .orElseThrow(() -> {
                logger.error("❌ Usuario no encontrado ID: {}", pedidoDTO.getUserId());
                return new ResourceNotFoundException("Usuario", "id", pedidoDTO.getUserId());
            });

        Pedido pedido = PedidoFactory.crearPedidoPendiente(
            usuario,
            pedidoDTO.getTotal(),
            pedidoDTO.getDireccionEntrega(),
            pedidoDTO.getTelefonoContacto(),
            pedidoDTO.getNotas()
        );

        pedido = pedidoRepository.save(pedido);
        logger.info("✅ Pedido base creado ID: {}", pedido.getPedidoId());

        for (DetallePedidoDTO detalleDTO : pedidoDTO.getDetalles()) {
            logger.debug("🍕 Agregando producto ID: {} - Cantidad: {}", detalleDTO.getProductoId(), detalleDTO.getCantidad());
            
            Producto producto = productosRepository.findById(detalleDTO.getProductoId())
                .orElseThrow(() -> {
                    logger.error("❌ Producto no encontrado ID: {}", detalleDTO.getProductoId());
                    return new ResourceNotFoundException("Producto", "id", detalleDTO.getProductoId());
                });

            DetallePedido detalle = DetallePedidoFactory.crearDetalle(
                pedido,
                producto,
                detalleDTO.getCantidad(),
                detalleDTO.getPrecioUnitario(),
                detalleDTO.getTamanio()
            );

            pedido.getDetalles().add(detalle);
        }

        Pedido pedidoFinal = pedidoRepository.save(pedido);
        logger.info("✅ Detalles guardados. Total de productos: {}", pedidoFinal.getDetalles().size());

        emailService.enviarConfirmacionPedido(
            PedidoMapper.toDTO(pedidoFinal),
            usuario.getEmail(),
            usuario.getNombreCompleto()
        );

        int puntosGanados = (int) Math.floor(pedidoFinal.getTotal());
        int puntosAnteriores = usuario.getPuntos();
        usuario.setPuntos(puntosAnteriores + puntosGanados);
        userRepository.save(usuario);
        
        logger.info("🎁 Puntos otorgados: +{} puntos ({} → {}) Usuario ID: {}", 
            puntosGanados, puntosAnteriores, usuario.getPuntos(), usuario.getId());
        
        logger.info("✅ Pedido creado exitosamente ID: {} - Total: S/{}", 
            pedidoFinal.getPedidoId(), pedidoFinal.getTotal());

        return PedidoMapper.toDTO(pedidoFinal);
    }

    public List<PedidoDTO> listarPedidosPorUsuario(Long userId) {
        logger.info("🔍 Listando pedidos del usuario ID: {}", userId);
        
        List<PedidoDTO> pedidos = pedidoRepository.findByUsuario_IdOrderByFechaPedidoDesc(userId)
                .stream()
                .map(PedidoMapper::toDTO)
                .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} pedidos para el usuario ID: {}", pedidos.size(), userId);
        return pedidos;
    }

    public List<Pedido> getPedidosPorUsuario(Long userId) {
        logger.info("🔍 Obteniendo pedidos (Model) del usuario ID: {}", userId);
        
        List<Pedido> pedidos = pedidoRepository.findByUsuario_Id(userId);
        
        logger.info("✅ Se encontraron {} pedidos para el usuario ID: {}", pedidos.size(), userId);
        return pedidos;
    }

    public List<PedidoDTO> listarTodosPedidos() {
        logger.info("📋 Listando todos los pedidos");
        
        List<PedidoDTO> pedidos = pedidoRepository.findAll()
            .stream()
            .map(PedidoMapper::toDTO)
            .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} pedidos en total", pedidos.size());
        return pedidos;
    }

    public PedidoDTO obtenerPedido(Long pedidoId) {
        logger.info("🔍 Buscando pedido ID: {}", pedidoId);
        
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> {
                logger.error("❌ Pedido no encontrado ID: {}", pedidoId);
                return new ResourceNotFoundException("Pedido", "id", pedidoId);
            });
        
        logger.info("✅ Pedido encontrado ID: {} - Estado: {}", pedidoId, pedido.getEstado());
        return PedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoDTO actualizarEstado(Long pedidoId, EstadoPedido nuevoEstado) {
        logger.info("✏️ Actualizando estado del pedido ID: {} a {}", pedidoId, nuevoEstado);
        
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new ResourceNotFoundException("Pedido", "id", pedidoId));
        
        EstadoPedido estadoAnterior = pedido.getEstado();
        pedido.setEstado(nuevoEstado);
        Pedido pedidoActualizado = pedidoRepository.save(pedido);
        
        logger.info("✅ Estado actualizado: {} → {} (Pedido ID: {})", estadoAnterior, nuevoEstado, pedidoId);
        
        emailService.enviarActualizacionEstadoPedido(
            pedidoId,
            nuevoEstado.toString(),
            pedido.getUsuario().getEmail(),
            pedido.getUsuario().getNombreCompleto()
        );
        
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    public void eliminarPedido(Long pedidoId) {
        logger.info("🗑️ Eliminando pedido ID: {}", pedidoId);
        
        if (!pedidoRepository.existsById(pedidoId)) {
            logger.error("❌ Pedido no encontrado ID: {}", pedidoId);
            throw new ResourceNotFoundException("Pedido", "id", pedidoId);
        }
        
        pedidoRepository.deleteById(pedidoId);
        logger.info("✅ Pedido eliminado exitosamente ID: {}", pedidoId);
    }

    public Page<PedidoDTO> listarPedidosPaginados(Pageable pageable) {
        logger.info("📋 Listando pedidos paginados - Página: {}, Tamaño: {}", 
            pageable.getPageNumber(), pageable.getPageSize());
        
        Page<PedidoDTO> pedidos = pedidoRepository.findAllByOrderByFechaPedidoDesc(pageable)
            .map(PedidoMapper::toDTO);
        
        logger.info("✅ Página {}/{} - {} pedidos encontrados de {} totales", 
            pedidos.getNumber() + 1, 
            pedidos.getTotalPages(), 
            pedidos.getNumberOfElements(),
            pedidos.getTotalElements());
        
        return pedidos;
    }

    public Page<PedidoDTO> buscarPedidos(
        EstadoPedido estado,
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Long userId,
        Pageable pageable
    ) {
        logger.info("🔍 Buscando pedidos con filtros:");
        logger.info("   - Estado: {}", estado != null ? estado : "Todos");
        logger.info("   - Usuario ID: {}", userId != null ? userId : "Todos");
        logger.info("   - Rango fechas: {} a {}", 
            fechaInicio != null ? fechaInicio : "Sin límite", 
            fechaFin != null ? fechaFin : "Sin límite");
        
        Page<PedidoDTO> pedidos = pedidoRepository.buscarPedidosConFiltros(
            estado, fechaInicio, fechaFin, userId, pageable
        ).map(PedidoMapper::toDTO);
        
        logger.info("✅ Se encontraron {} pedidos que coinciden con los filtros (Página {}/{})", 
            pedidos.getTotalElements(),
            pedidos.getNumber() + 1,
            pedidos.getTotalPages());
        
        return pedidos;
    }
}
