package com.example.mikespizza.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Service.UserService;
import com.example.mikespizza.dto.UserDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody UserDTO userDTO) {
        try {
            logger.info("📝 Solicitud de registro para: {}", userDTO.getEmail());
            UserDTO nuevoUsuario = userService.registrarUsuario(userDTO);  
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (IllegalArgumentException e) {
            logger.error("❌ Error de validación: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("❌ Error al registrar usuario: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario");
        }
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> listarUsuarios() {
        logger.info("📋 Solicitud para listar usuarios");
        List<UserDTO> usuarios = userService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> obtenerUsuarioPorId(@PathVariable Long id) {
        logger.info("🔍 Buscando usuario ID: {}", id);
        UserDTO usuario = userService.buscarPorId(id);  
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> obtenerUsuarioPorEmail(@PathVariable String email) {
        logger.info("🔍 Buscando usuario por email: {}", email);
        UserDTO usuario = userService.buscarPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/agregar-puntos/{id}")
    public ResponseEntity<?> agregarPuntos(@PathVariable Long id, @RequestParam int puntos) {
        try {
            logger.info("🎁 Solicitud para agregar {} puntos al usuario ID: {}", puntos, id);
            UserDTO usuario = userService.agregarPuntos(id, puntos);  
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            logger.error("❌ Error al agregar puntos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> obtenerUsuarioAutenticado(Authentication authentication) {
        try {
            logger.info("👤 Solicitud de datos del usuario autenticado");
            
            String email = authentication.getName();
            logger.info("🔍 Email del token: {}", email);
            
            UserDTO usuario = userService.buscarPorEmail(email);
            logger.info("✅ Usuario encontrado: {} con {} puntos", usuario.getEmail(), usuario.getPuntos());
            
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            logger.error("❌ Error al obtener usuario autenticado: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/canjear-puntos/{id}")
    public ResponseEntity<?> canjearPuntos(@PathVariable Long id, @RequestParam int puntos) {
        try {
            logger.info("💰 Solicitud para canjear {} puntos del usuario ID: {}", puntos, id);
            UserDTO usuario = userService.canjearPuntos(id, puntos); 
            return ResponseEntity.ok(usuario);
        } catch (IllegalArgumentException e) {
            logger.error("❌ Error al canjear puntos: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("❌ Error inesperado: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al canjear puntos");
        }
    }

    @GetMapping("/{userId}/perfil")
    public ResponseEntity<UserDTO> obtenerPerfil(@PathVariable Long userId) {
        logger.info("👤 Solicitud de perfil para usuario ID: {}", userId);
        UserDTO usuario = userService.buscarPorId(userId); 
        return ResponseEntity.ok(usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            logger.info("🗑️ Solicitud para eliminar usuario ID: {}", id);
            userService.eliminarUsuario(id); 
            return ResponseEntity.ok("Usuario eliminado exitosamente");
        } catch (Exception e) {
            logger.error("❌ Error al eliminar usuario: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
