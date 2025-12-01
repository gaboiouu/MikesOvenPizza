package com.example.mikespizza.Mapper;

import com.example.mikespizza.Model.User;
import com.example.mikespizza.dto.UserDTO;

public class UserMapper {
    public static UserDTO toDTO(User user) {
        return new UserDTO(
            user.getEmail(),
            null, 
            user.getRol(),
            user.getFechaRegistro(),
            user.getNombreCompleto(),
            user.getPuntos()
        );
    }
}