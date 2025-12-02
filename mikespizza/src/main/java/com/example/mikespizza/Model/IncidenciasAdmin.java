package com.example.mikespizza.Model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "incidencias_admin")
public class IncidenciasAdmin {
    public enum TipoIncidencia {
        PRODUCCION_COCINA("Incidencia de Producción (Cocina)"),
        PEDIDOS("Incidencia de Pedidos"),
        DELIVERY("Incidencia de Delivery"),
        CAJA_PAGOS("Incidencia de Caja y Pagos"),
        SISTEMA("Incidencia del Sistema"),
        PERSONAL("Incidencia de Personal"),
        LIMPIEZA_SEGURIDAD("Incidencia de Limpieza & Seguridad Alimentaria"),
        INFRAESTRUCTURA("Incidencia de Infraestructura"),
        SEGURIDAD("Incidencia de Seguridad"),
        ADMINISTRATIVA("Incidencia Administrativa");
        
        private final String displayName;
        
        TipoIncidencia(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum EstadoIncidencia {
        ABIERTO("Abierto"),
        EN_PROCESO("En Proceso"),
        CERRADO("Cerrado");
        
        private final String displayName;
        
        EstadoIncidencia(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    public enum PrioridadIncidencia {
        ALTA("Alta"),
        MEDIA("Media"),
        BAJA("Baja");
        
        private final String displayName;
        
        PrioridadIncidencia(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "reportado_por", nullable = false)
    private User reportadoPor;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User creadoPor;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoIncidencia tipo;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(columnDefinition = "TEXT")
    private String descripcion;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoIncidencia estado = EstadoIncidencia.ABIERTO;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PrioridadIncidencia prioridad;
    
    @Column(nullable = false)
    private String responsable;
    
    @Column(nullable = false)
    private LocalDate fechaCreacion;
    
    private LocalDate fechaCierre;
    
    // Constructores
    public IncidenciasAdmin() {
        this.fechaCreacion = LocalDate.now();
        this.estado = EstadoIncidencia.ABIERTO;
    }
    
    public IncidenciasAdmin(User reportadoPor, TipoIncidencia tipo, String titulo, String descripcion, 
                           PrioridadIncidencia prioridad, String responsable) {
        this.reportadoPor = reportadoPor;
        this.tipo = tipo;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.prioridad = prioridad;
        this.responsable = responsable;
        this.estado = EstadoIncidencia.ABIERTO;
        this.fechaCreacion = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getReportadoPor() { return reportadoPor; }
    public void setReportadoPor(User reportadoPor) { this.reportadoPor = reportadoPor; }
    
    public User getCreadoPor() { return creadoPor; }
    public void setCreadoPor(User creadoPor) { this.creadoPor = creadoPor; }
    
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
    
    public LocalDate getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDate fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    
    public LocalDate getFechaCierre() { return fechaCierre; }
    public void setFechaCierre(LocalDate fechaCierre) { this.fechaCierre = fechaCierre; }
}
