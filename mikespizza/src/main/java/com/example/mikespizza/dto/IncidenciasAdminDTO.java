package com.example.mikespizza.dto;

import java.time.LocalDate;

import com.example.mikespizza.Model.IncidenciasAdmin.EstadoIncidencia;
import com.example.mikespizza.Model.IncidenciasAdmin.PrioridadIncidencia;
import com.example.mikespizza.Model.IncidenciasAdmin.TipoIncidencia;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class IncidenciasAdminDTO {
    private Long id;

    @NotNull(message = "El tipo de incidencia no puede ser nulo")
    private TipoIncidencia tipo;

    @NotBlank(message = "El título no puede estar vacío")
    @Size(min = 5, max = 200, message = "El título debe tener entre 5 y 200 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción no puede estar vacía")
    @Size(min = 10, max = 1000, message = "La descripción debe tener entre 10 y 1000 caracteres")
    private String descripcion;

    @NotNull(message = "El estado no puede ser nulo")
    private EstadoIncidencia estado; 

    @NotNull(message = "La prioridad no puede ser nula")
    private PrioridadIncidencia prioridad;

    private String responsable;
    private Long reportadoPorId;
    private String reportadoPorNombre;
    private Long creadoPorId;
    private String creadoPorNombre;
    private LocalDate fechaCreacion;
    private LocalDate fechaCierre;

    public IncidenciasAdminDTO() {}

    public IncidenciasAdminDTO(Long id, TipoIncidencia tipo, String titulo, String descripcion,
                              EstadoIncidencia estado, PrioridadIncidencia prioridad, String responsable,
                              Long reportadoPorId, String reportadoPorNombre,
                              Long creadoPorId, String creadoPorNombre,
                              LocalDate fechaCreacion, LocalDate fechaCierre) {
        this.id = id;
        this.tipo = tipo;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.prioridad = prioridad;
        this.responsable = responsable;
        this.reportadoPorId = reportadoPorId;
        this.reportadoPorNombre = reportadoPorNombre;
        this.creadoPorId = creadoPorId;
        this.creadoPorNombre = creadoPorNombre;
        this.fechaCreacion = fechaCreacion;
        this.fechaCierre = fechaCierre;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public TipoIncidencia getTipo() { return tipo; }
    public void setTipo(TipoIncidencia tipo) { this.tipo = tipo; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public EstadoIncidencia getEstado() { return estado; }
    public void setEstado(EstadoIncidencia estado) { this.estado = estado; }

    public PrioridadIncidencia getPrioridad() { return prioridad; }
    public void setPrioridad(PrioridadIncidencia prioridad) { this.prioridad = prioridad; }

    public String getResponsable() { return responsable; }
    public void setResponsable(String responsable) { this.responsable = responsable; }

    public Long getReportadoPorId() { return reportadoPorId; }
    public void setReportadoPorId(Long reportadoPorId) { this.reportadoPorId = reportadoPorId; }

    public String getReportadoPorNombre() { return reportadoPorNombre; }
    public void setReportadoPorNombre(String reportadoPorNombre) { this.reportadoPorNombre = reportadoPorNombre; }

    public Long getCreadoPorId() { return creadoPorId; }
    public void setCreadoPorId(Long creadoPorId) { this.creadoPorId = creadoPorId; }

    public String getCreadoPorNombre() { return creadoPorNombre; }
    public void setCreadoPorNombre(String creadoPorNombre) { this.creadoPorNombre = creadoPorNombre; }

    public LocalDate getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDate fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDate getFechaCierre() { return fechaCierre; }
    public void setFechaCierre(LocalDate fechaCierre) { this.fechaCierre = fechaCierre; }
}
