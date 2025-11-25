package com.example.mikespizza.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.mikespizza.Factory.UserFactory;
import com.example.mikespizza.Model.User;
import com.example.mikespizza.Repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String email, String password, String nombreCompleto) throws Exception {
        if (!isValidEmail(email)) {
            throw new Exception("Email inválido");
        }
        if (!isValidPassword(password)) {
            throw new Exception("Password insegura");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email ya registrado");
        }
        String encryptedPassword = passwordEncoder.encode(password);
        User user = UserFactory.crearUser(email, encryptedPassword, User.Rol.CLIENTE, LocalDateTime.now(), nombreCompleto);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
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