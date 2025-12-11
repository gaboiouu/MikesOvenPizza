package com.example.mikespizza.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.mikespizza.dto.PedidoDTO;
import com.example.mikespizza.dto.ReservaDTO;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;


    @Async
    public void enviarConfirmacionPedido(PedidoDTO pedido, String emailCliente, String nombreCliente) {
        try {
            logger.info("📧 Enviando email de pedido #{} a {}", pedido.getPedidoId(), emailCliente);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailCliente);
            message.setSubject("✅ Mike's Pizza - Pedido #" + pedido.getPedidoId() + " Confirmado");
            message.setText(construirMensajePedido(pedido, nombreCliente));
            
            mailSender.send(message);
            logger.info("✅ Email de pedido enviado exitosamente");
            
        } catch (Exception e) {
            logger.error("❌ Error al enviar email de pedido: {}", e.getMessage());
        }
    }


    @Async
    public void enviarConfirmacionReserva(ReservaDTO reserva, String emailCliente, String nombreCliente) {
        try {
            logger.info("📧 Enviando email de reserva #{} a {}", reserva.getId(), emailCliente);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailCliente);
            message.setSubject("✅ Mike's Pizza - Reserva Confirmada");
            message.setText(construirMensajeReserva(reserva, nombreCliente));
            
            mailSender.send(message);
            logger.info("✅ Email de reserva enviado exitosamente");
            
        } catch (Exception e) {
            logger.error("❌ Error al enviar email de reserva: {}", e.getMessage());
        }
    }

    @Async
    public void enviarActualizacionEstadoPedido(Long pedidoId, String nuevoEstado, String emailCliente, String nombreCliente) {
        try {
            logger.info("📧 Enviando actualización de pedido #{} a {}", pedidoId, emailCliente);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailCliente);
            message.setSubject("📦 Mike's Pizza - Actualización de Pedido #" + pedidoId);
            message.setText(
                "¡Hola " + nombreCliente + "!\n\n" +
                "Tu pedido #" + pedidoId + " ha sido actualizado.\n\n" +
                "📦 Nuevo estado: " + nuevoEstado + "\n\n" +
                "Gracias por tu preferencia,\n" +
                "Mike's Pizza 🍕\n" +
                "Horario: 5:00 PM - 11:59 PM (Cerrado los lunes)"
            );
            
            mailSender.send(message);
            logger.info("✅ Email de actualización enviado");
            
        } catch (Exception e) {
            logger.error("❌ Error al enviar email de actualización: {}", e.getMessage());
        }
    }

    private String construirMensajePedido(PedidoDTO pedido, String nombreCliente) {
        StringBuilder msg = new StringBuilder();
        msg.append("¡Hola ").append(nombreCliente).append("!\n\n");
        msg.append("Tu pedido ha sido confirmado exitosamente.\n\n");
        msg.append("📦 DETALLES DEL PEDIDO\n");
        msg.append("═══════════════════════\n");
        msg.append("Número de pedido: #").append(pedido.getPedidoId()).append("\n");
        msg.append("Estado: ").append(pedido.getEstado()).append("\n");
        msg.append("Total: S/").append(String.format("%.2f", pedido.getTotal())).append("\n");
        msg.append("Dirección: ").append(pedido.getDireccionEntrega()).append("\n");
        msg.append("Teléfono: ").append(pedido.getTelefonoContacto()).append("\n\n");
        
        msg.append("🍕 PRODUCTOS\n");
        msg.append("═══════════════════════\n");
        
        if (pedido.getDetalles() != null && !pedido.getDetalles().isEmpty()) {
            pedido.getDetalles().forEach(detalle -> {
                msg.append("• ").append(detalle.getCantidad()).append("x ")
                   .append(detalle.getNombreProducto()) 
                   .append(" (").append(detalle.getTamanio()).append(")")  
                   .append(" - S/").append(String.format("%.2f", detalle.getSubtotal())) 
                   .append("\n");
            });
        } else {
            msg.append("(Sin detalles)\n");
        }
        
        msg.append("\n¡Gracias por tu compra!\n\n");
        msg.append("Mike's Pizza 🍕\n");
        msg.append("Horario: 5:00 PM - 11:59 PM\n");
        msg.append("Cerrado los lunes\n");
        msg.append("Tel: (01) 234-5678");
        
        return msg.toString();
    }

    private String construirMensajeReserva(ReservaDTO reserva, String nombreCliente) {
        StringBuilder msg = new StringBuilder();
        msg.append("¡Hola ").append(nombreCliente).append("!\n\n");
        msg.append("Tu reserva ha sido confirmada.\n\n");
        msg.append("📅 DETALLES DE LA RESERVA\n");
        msg.append("═══════════════════════\n");
        msg.append("Número: #").append(reserva.getId()).append("\n");
        msg.append("Fecha: ").append(reserva.getFecha()).append("\n");
        msg.append("Hora: ").append(reserva.getHora()).append("\n");
        msg.append("Personas: ").append(reserva.getNroPersonas()).append("\n");
        
        if (reserva.getMensajeAdicional() != null && !reserva.getMensajeAdicional().isEmpty()) {
            msg.append("Notas: ").append(reserva.getMensajeAdicional()).append("\n");
        }
        
        if (reserva.getTelefono() != null && !reserva.getTelefono().isEmpty()) {
            msg.append("Teléfono: ").append(reserva.getTelefono()).append("\n");
        }
        
        msg.append("\n¡Te esperamos!\n\n");
        msg.append("Mike's Pizza 🍕\n");
        msg.append("Horario: 5:00 PM - 11:59 PM\n");
        msg.append("Tel: (01) 234-5678");
        
        return msg.toString();
    }
}