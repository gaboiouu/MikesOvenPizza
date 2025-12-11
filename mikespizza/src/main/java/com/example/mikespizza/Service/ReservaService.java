package com.example.mikespizza.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.mikespizza.Factory.ReservaFactory;
import com.example.mikespizza.Mapper.ReservaMapper;
import com.example.mikespizza.Model.Reserva;
import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.ReservaRepository;
import com.example.mikespizza.Repository.UserRepository;
import com.example.mikespizza.dto.ReservaDTO;
import com.example.mikespizza.exception.ResourceNotFoundException;

@Service
public class ReservaService {

    private static final Logger logger = LoggerFactory.getLogger(ReservaService.class);

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public ReservaDTO crearReserva(ReservaDTO reservaDTO) {
        logger.info("📅 Creando reserva para usuario ID: {}", reservaDTO.getUserId());
        
        validarHorario(reservaDTO.getHora(), reservaDTO.getFecha());
        
        validarCapacidad(reservaDTO.getFecha(), reservaDTO.getHora(), reservaDTO.getNroPersonas());
        
        User usuario = userRepository.findById(reservaDTO.getUserId())
            .orElseThrow(() -> {
                logger.error("❌ Usuario no encontrado ID: {}", reservaDTO.getUserId());
                return new ResourceNotFoundException("Usuario", "id", reservaDTO.getUserId());
            });

        Reserva reserva = ReservaFactory.crearReserva(
            usuario,                         
            reservaDTO.getNroPersonas(),       
            reservaDTO.getFecha(),           
            reservaDTO.getHora(),               
            reservaDTO.getMensajeAdicional(),    
            reservaDTO.getTelefono()             
        );

        Reserva reservaGuardada = reservaRepository.save(reserva);
        
        emailService.enviarConfirmacionReserva(
            ReservaMapper.toDTO(reservaGuardada),
            usuario.getEmail(),
            usuario.getNombreCompleto()
        );
        
        logger.info("✅ Reserva creada ID: {} - Fecha: {} Hora: {}", 
            reservaGuardada.getId(), 
            reservaGuardada.getFecha(), 
            reservaGuardada.getHora());

        return ReservaMapper.toDTO(reservaGuardada);
    }

    private void validarHorario(String hora, LocalDate fecha) {
        logger.debug("🕐 Validando horario: {} el {}", hora, fecha);
        
        LocalTime horaReserva = LocalTime.parse(hora);
        LocalTime apertura = LocalTime.of(17, 0);  
        LocalTime cierre = LocalTime.of(23, 59);    
        
        if (horaReserva.isBefore(apertura) || horaReserva.isAfter(cierre)) {
            logger.error("❌ Horario fuera de rango: {}", horaReserva);
            throw new IllegalArgumentException(
                "Horario de atención: 5:00 PM - 11:59 PM. Hora solicitada: " + hora
            );
        }
        
        LocalDate hoy = LocalDate.now();
        if (fecha.isBefore(hoy)) {
            logger.error("❌ Intento de reserva en fecha pasada: {}", fecha);
            throw new IllegalArgumentException("No se pueden hacer reservas en fechas pasadas");
        }
        
        if (fecha.isEqual(hoy)) {
            LocalTime ahora = LocalTime.now();
            LocalTime horaLimite = horaReserva.minusHours(2);
            
            if (ahora.isAfter(horaLimite)) {
                logger.error("❌ Reserva con menos de 2 horas de anticipación. Hora actual: {}, Hora reserva: {}", 
                    ahora, horaReserva);
                throw new IllegalArgumentException(
                    "Las reservas para hoy deben hacerse con al menos 2 horas de anticipación. " +
                    "Hora actual: " + ahora.format(java.time.format.DateTimeFormatter.ofPattern("HH:mm")) + 
                    ", Hora de reserva: " + hora
                );
            }
        }
        
        logger.debug("✅ Horario válido");
    }

    private void validarCapacidad(LocalDate fecha, String hora, int nroPersonas) {
        logger.debug("👥 Validando capacidad para {} personas", nroPersonas);
        
        Integer personasReservadas = reservaRepository.contarPersonasPorFechaYHora(fecha, hora);
        int capacidadMaxima = 50; 
        int capacidadDisponible = capacidadMaxima - personasReservadas;
        
        if (nroPersonas > capacidadDisponible) {
            logger.error("❌ Capacidad insuficiente. Disponible: {}, Solicitado: {}", 
                capacidadDisponible, nroPersonas);
            throw new IllegalArgumentException(
                String.format(
                    "No hay capacidad suficiente para esa hora. " +
                    "Disponible: %d personas, Solicitado: %d personas. " +
                    "Por favor seleccione otro horario.", 
                    capacidadDisponible, 
                    nroPersonas
                )
            );
        }
        
        if (nroPersonas < 1) {
            logger.error("❌ Número inválido de personas: {}", nroPersonas);
            throw new IllegalArgumentException("Debe haber al menos 1 persona para la reserva");
        }

        if (nroPersonas > 15) {
            logger.error("❌ Grupo demasiado grande: {} personas", nroPersonas);
            throw new IllegalArgumentException(
                "Para grupos mayores a 15 personas, por favor comuníquese directamente con el restaurante al 960257327"
            );
        }
        
        logger.debug("✅ Capacidad disponible: {} de {} personas", capacidadDisponible, capacidadMaxima);
    }

    public List<ReservaDTO> listarReservas() {
        logger.info("📋 Listando todas las reservas");
        
        List<ReservaDTO> reservas = reservaRepository.findAll()
                .stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} reservas", reservas.size());
        return reservas;
    }

    public List<ReservaDTO> obtenerReservasPorUsuario(Long userId) {
        logger.info("🔍 Buscando reservas del usuario ID: {}", userId);
        
        List<ReservaDTO> reservas = reservaRepository.findByUsuarioId(userId)
                .stream()
                .map(ReservaMapper::toDTO)
                .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} reservas para el usuario ID: {}", reservas.size(), userId);
        return reservas;
    }

    public ReservaDTO actualizarReserva(Long id, ReservaDTO reservaDTO) {
        logger.info("✏️ Actualizando reserva ID: {}", id);
        
        Reserva reserva = reservaRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Reserva no encontrada ID: {}", id);
                return new ResourceNotFoundException("Reserva", "id", id);
            });

        if (reservaDTO.getNroPersonas() > 0) {
            reserva.setNroPersonas(reservaDTO.getNroPersonas());
        }
        if (reservaDTO.getFecha() != null) {
            reserva.setFecha(reservaDTO.getFecha());
        }
        if (reservaDTO.getHora() != null) {
            reserva.setHora(reservaDTO.getHora());
        }
        if (reservaDTO.getMensajeAdicional() != null) {
            reserva.setMensajeAdicional(reservaDTO.getMensajeAdicional());
        }
        if (reservaDTO.getTelefono() != null) {
            reserva.setTelefono(reservaDTO.getTelefono());
        }

        Reserva updated = reservaRepository.save(reserva);
        logger.info("✅ Reserva actualizada exitosamente ID: {}", id);
        
        return ReservaMapper.toDTO(updated);
    }

    public void eliminarReserva(Long id) {
        logger.info("🗑️ Eliminando reserva ID: {}", id);
        
        if (!reservaRepository.existsById(id)) {
            logger.error("❌ Reserva no encontrada ID: {}", id);
            throw new ResourceNotFoundException("Reserva", "id", id);
        }
        
        reservaRepository.deleteById(id);
        logger.info("✅ Reserva eliminada exitosamente ID: {}", id);
    }

    public Page<ReservaDTO> listarReservasPaginadas(Pageable pageable) {
        logger.info("📋 Listando reservas paginadas - Página: {}, Tamaño: {}", 
            pageable.getPageNumber(), pageable.getPageSize());
        
        Page<ReservaDTO> reservas = reservaRepository.findAllByOrderByFechaDesc(pageable)
            .map(ReservaMapper::toDTO);
        
        logger.info("✅ Página {}/{} - {} reservas encontradas", 
            reservas.getNumber() + 1, 
            reservas.getTotalPages(), 
            reservas.getNumberOfElements());
        
        return reservas;
    }

    public Page<ReservaDTO> buscarReservas(
        LocalDate fecha,
        Long userId,
        Integer nroPersonas,
        Pageable pageable
    ) {
        logger.info("🔍 Buscando reservas - Fecha: {}, Usuario: {}, Personas: {}", 
            fecha, userId, nroPersonas);
        
        Page<ReservaDTO> reservas = reservaRepository.buscarReservasConFiltros(
            fecha, userId, nroPersonas, pageable
        ).map(ReservaMapper::toDTO);
        
        logger.info("✅ Se encontraron {} reservas", reservas.getTotalElements());
        
        return reservas;
    }
}
