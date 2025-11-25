package com.example.mikespizza.dto;

import java.time.LocalDateTime;

import com.example.mikespizza.Model.User;

public class UserDTO {
    private String email;
    private String password;
    private User.Rol rol;
    private LocalDateTime fechaRegistro;
    private String nombreCompleto;

    public UserDTO() {}

    public UserDTO(String email, String password, User.Rol rol, LocalDateTime fechaRegistro, String nombreCompleto) {
        this.email = email;
        this.password = password;
        this.rol = rol;
        this.fechaRegistro = fechaRegistro;
        this.nombreCompleto = nombreCompleto;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public User.Rol getRol() { return rol; }
    public void setRol(User.Rol rol) { this.rol = rol; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
}