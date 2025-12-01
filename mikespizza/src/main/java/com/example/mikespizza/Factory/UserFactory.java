package com.example.mikespizza.Factory;

import java.time.LocalDateTime;

import com.example.mikespizza.Model.User;

public class UserFactory {
    public static User crearUser(String email, String password, User.Rol rol, LocalDateTime fechaRegistro, String nombreCompleto) {
        return new User(email, password, rol, fechaRegistro, nombreCompleto,0);
    }

     public static User crearUserConPuntos(String email, String password, User.Rol rol, LocalDateTime fechaRegistro, String nombreCompleto, Integer puntos) {
        return new User(email, password, rol, fechaRegistro, nombreCompleto, puntos);
    }
}