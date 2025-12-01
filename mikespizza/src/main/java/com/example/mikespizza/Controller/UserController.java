package com.example.mikespizza.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.UserRepository;
import com.example.mikespizza.Service.UserService;
import com.example.mikespizza.dto.UserDTO;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/registrar")
    public User registrarUsuario(@RequestBody UserDTO userDTO) throws Exception {
        return userService.registerUser(userDTO.getEmail(), userDTO.getPassword(), userDTO.getNombreCompleto());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @PostMapping("/login")
    public User login(@RequestBody UserDTO userDTO) {
        User user = userRepository.findByEmail(userDTO.getEmail())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().matches(userDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        return user;
    }

    @PostMapping("/agregar-puntos/{id}")
    public User agregarPuntos(@PathVariable Long id, @RequestParam int puntos) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return userService.agregarPuntos(user, puntos);
    }

    @PostMapping("/canjear-puntos/{id}")
    public User canjearPuntos(@PathVariable Long id, @RequestParam int puntos) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return userService.canjearPuntos(user, puntos);
    }

    @GetMapping("/{userId}/perfil")
    public ResponseEntity<UserDTO> obtenerPerfil(@PathVariable Long userId) throws Exception {
        User usuario = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));
        
        UserDTO dto = new UserDTO(
            usuario.getEmail(),
            null, 
            usuario.getRol(),
            usuario.getFechaRegistro(),
            usuario.getNombreCompleto(),
            usuario.getPuntos()
        );
        return ResponseEntity.ok(dto);
    }
}
