package com.example.mikespizza.Model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User usuario;

    @Column(nullable = false)
    private int nroPersonas;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private String hora;

    @Column
    private String mensajeAdicional;

    @Column(nullable = false)
    private String telefono;

    public Reserva(User usuario, int nroPersonas, LocalDate fecha, String hora, String mensajeAdicional, String telefono) {
        this.usuario = usuario;
        this.nroPersonas = nroPersonas;
        this.fecha = fecha;
        this.hora = hora;
        this.mensajeAdicional = mensajeAdicional;
        this.telefono = telefono;
    }

    public Long getId() { return id; }
    public User getUsuario() { return usuario; }
    public void setUsuario(User usuario) { this.usuario = usuario; }
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