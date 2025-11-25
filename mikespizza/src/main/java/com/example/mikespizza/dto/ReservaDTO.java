package com.example.mikespizza.dto;

import java.time.LocalDate;

public class ReservaDTO {
    private Long id;
    private Long userId;
    private int nroPersonas;
    private LocalDate fecha;
    private String hora;
    private String mensajeAdicional;
    private String telefono;

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
}
