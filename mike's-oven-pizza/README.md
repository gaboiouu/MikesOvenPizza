# Mike's Oven Pizza - Full Stack Architecture

## Backend Implementation Guide (Spring Boot)

Since this environment renders the Frontend (React), here is the architectural specification for the Java Spring Boot Backend required to support this application.

### 1. Tech Stack
- **Language:** Java 21
- **Framework:** Spring Boot 3.x
- **Database:** PostgreSQL
- **ORM:** Hibernate / Spring Data JPA

### 2. Entity Relationships

#### `Pizza` Entity
```java
@Entity
public class Pizza {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private Double price;
    private String imageUrl;
    private String category; // ENUM: CLASICA, PREMIUM, COMBO, BEBIDA
}
```

#### `Incident` Entity (ITIL)
```java
@Entity
public class Incident {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    @Enumerated(EnumType.STRING)
    private Status status; // OPEN, IN_PROGRESS, CLOSED
    @Enumerated(EnumType.STRING)
    private Priority priority; // HIGH, MEDIUM, LOW
    private String responsible;
    private LocalDate createdAt;
    private LocalDate closedAt;
}
```

### 3. API Endpoints Required

- `GET /api/carta` - Returns list of pizzas.
- `POST /api/pedidos` - Receives order details (connects to WhatsApp log or DB).
- `POST /api/reservas` - Saves reservation data.
- `GET /api/incidencias` - List all ITIL incidents.
- `POST /api/incidencias` - Create new incident.
- `PUT /api/incidencias/{id}` - Update status/details.

### 4. Setup
1. Configure `application.properties` with PostgreSQL credentials.
2. Use `data.sql` to seed the `ITILSection` and initial `Pizza` data.
3. Enable CORS globally to allow requests from the React Frontend.

