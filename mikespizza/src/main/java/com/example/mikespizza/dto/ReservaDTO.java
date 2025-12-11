package com.example.mikespizza.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ReservaDTO {
    private Long id;

    @NotNull(message = "El ID del usuario no puede ser nulo")
    private Long userId;

    @NotNull(message = "El número de personas no puede ser nulo")
    @Min(value = 1, message = "Debe haber al menos 1 persona")
    @Max(value = 15, message = "Máximo 15 personas por reserva")
    private int nroPersonas;

    @NotNull(message = "La fecha de reserva no puede ser nula")
    @Future(message = "La fecha debe ser futura")
    private LocalDate fecha;

    @NotBlank(message = "La hora de reserva no puede estar vacía")
    @Pattern(regexp = "^([01]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Formato de hora inválido (HH:mm)")
    private String hora;

    @Size(max = 500, message = "El mensaje adicional no puede exceder 500 caracteres")
    private String mensajeAdicional;

    @Pattern(regexp = "^[0-9]{9,15}$", message = "Formato de teléfono inválido (solo números, 9-15 dígitos)")
    private String telefono;

    private UsuarioReservaDTO usuario;

    public ReservaDTO() {}

    public ReservaDTO(Long id, Long userId, int nroPersonas, LocalDate fecha, String hora, String mensajeAdicional, String telefono) {
        this.id = id;
        this.userId = userId;
        this.nroPersonas = nroPersonas;
        this.fecha = fecha;
        this.hora = hora;
        this.mensajeAdicional = mensajeAdicional;
        this.telefono = telefono;
    }

    public ReservaDTO(Long id, Long userId, int nroPersonas, LocalDate fecha, String hora, String mensajeAdicional, String telefono, UsuarioReservaDTO usuario) {
        this.id = id;
        this.userId = userId;
        this.nroPersonas = nroPersonas;
        this.fecha = fecha;
        this.hora = hora;
        this.mensajeAdicional = mensajeAdicional;
        this.telefono = telefono;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getNroPersonas() { return nroPersonas; }
    public void setNroPersonas(int nroPersonas) { this.nroPersonas = nroPersonas; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }

    public String getMensajeAdicional() { return mensajeAdicional; }
    public void setMensajeAdicional(String mensajeAdicional) { this.mensajeAdicional = mensajeAdicional; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public UsuarioReservaDTO getUsuario() { return usuario; }
    public void setUsuario(UsuarioReservaDTO usuario) { this.usuario = usuario; }

    public static class UsuarioReservaDTO {
        private Long id;
        private String nombreCompleto;
        private String email;
        private String telefono;

        public UsuarioReservaDTO() {}

        public UsuarioReservaDTO(Long id, String nombreCompleto, String email, String telefono) {
            this.id = id;
            this.nombreCompleto = nombreCompleto;
            this.email = email;
            this.telefono = telefono;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getTelefono() { return telefono; }
        public void setTelefono(String telefono) { this.telefono = telefono; }
    }
}
