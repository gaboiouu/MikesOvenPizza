package com.example.mikespizza.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.UserFactory;
import com.example.mikespizza.Mapper.UserMapper;
import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.UserRepository;
import com.example.mikespizza.dto.UserDTO;
import com.example.mikespizza.exception.ResourceNotFoundException;

@Service
public class UserService {
    
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO registrarUsuario(UserDTO userDTO) {
        logger.info("📝 Registrando nuevo usuario: {}", userDTO.getEmail());
        
        if (!isValidEmail(userDTO.getEmail())) {
            logger.error("❌ Email inválido: {}", userDTO.getEmail());
            throw new IllegalArgumentException("Email inválido");
        }
        
        if (!isValidPassword(userDTO.getPassword())) {
            logger.error("❌ Contraseña insegura para: {}", userDTO.getEmail());
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial");
        }
        
        if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            logger.error("❌ Email ya registrado: {}", userDTO.getEmail());
            throw new IllegalArgumentException("Email ya registrado");
        }
        
        String encryptedPassword = passwordEncoder.encode(userDTO.getPassword());
        User user = UserFactory.crearUser(
            userDTO.getEmail(), 
            encryptedPassword, 
            userDTO.getRol() != null ? userDTO.getRol() : User.Rol.CLIENTE, 
            LocalDateTime.now(), 
            userDTO.getNombreCompleto()
        );
        
        User saved = userRepository.save(user);
        logger.info("✅ Usuario registrado exitosamente: {} (ID: {})", saved.getEmail(), saved.getId());
        
        return UserMapper.toDTO(saved);
    }

    public UserDTO buscarPorEmail(String email) {
        logger.info("🔍 Buscando usuario por email: {}", email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> {
                logger.error("❌ Usuario no encontrado: {}", email);
                return new ResourceNotFoundException("Usuario", "email", email);
            });
        
        logger.info("✅ Usuario encontrado: {} (ID: {})", user.getEmail(), user.getId());
        return UserMapper.toDTO(user);
    }

    public UserDTO buscarPorId(Long id) {
        logger.info("🔍 Buscando usuario por ID: {}", id);
        
        User user = userRepository.findById(id)
            .orElseThrow(() -> {
                logger.error("❌ Usuario no encontrado ID: {}", id);
                return new ResourceNotFoundException("Usuario", "id", id);
            });
        
        logger.info("✅ Usuario encontrado: {} (ID: {})", user.getEmail(), user.getId());
        return UserMapper.toDTO(user);
    }

    public List<UserDTO> listarUsuarios() {
        logger.info("📋 Listando todos los usuarios");
        
        List<UserDTO> usuarios = userRepository.findAll()
            .stream()
            .map(UserMapper::toDTO)
            .collect(Collectors.toList());
        
        logger.info("✅ Se encontraron {} usuarios", usuarios.size());
        return usuarios;
    }

    public UserDTO agregarPuntos(Long userId, int puntos) {
        logger.info("🎁 Agregando {} puntos al usuario ID: {}", puntos, userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));
        
        int puntosAnteriores = user.getPuntos();
        user.setPuntos(user.getPuntos() + puntos);
        
        User saved = userRepository.save(user);
        logger.info("✅ Puntos actualizados: {} → {} (Usuario ID: {})", puntosAnteriores, saved.getPuntos(), userId);
        
        return UserMapper.toDTO(saved);
    }

    public UserDTO canjearPuntos(Long userId, int puntosACanjear) {
        logger.info("💰 Canjeando {} puntos del usuario ID: {}", puntosACanjear, userId);
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", userId));
        
        if (user.getPuntos() < puntosACanjear) {
            logger.error("❌ Puntos insuficientes. Usuario tiene: {}, intenta canjear: {}", user.getPuntos(), puntosACanjear);
            throw new IllegalArgumentException("No tienes suficientes puntos para canjear");
        }

        user.setPuntos(user.getPuntos() - puntosACanjear);
        double valorPorPunto = 0.10; 
        double descuento = puntosACanjear * valorPorPunto;
        
        User saved = userRepository.save(user);
        logger.info("✅ Puntos canjeados. Descuento aplicado: S/{} (Usuario ID: {})", descuento, userId);
        
        return UserMapper.toDTO(saved);
    }

    public void eliminarUsuario(Long id) {
        logger.info("🗑️ Eliminando usuario ID: {}", id);
        
        if (!userRepository.existsById(id)) {
            logger.error("❌ Usuario no encontrado ID: {}", id);
            throw new ResourceNotFoundException("Usuario", "id", id);
        }
        
        userRepository.deleteById(id);
        logger.info("✅ Usuario eliminado exitosamente ID: {}", id);
    }

    private boolean isValidEmail(String email) {
        return email != null && email.contains("@");
    }

    private boolean isValidPassword(String password) {
        if (password == null) return false;
        String regex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        return Pattern.matches(regex, password);
    }
}