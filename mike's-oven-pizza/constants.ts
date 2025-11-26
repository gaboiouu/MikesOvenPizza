import { Pizza, Incident, IncidentStatus, IncidentPriority } from './types';

export const COLORS = {
  verdeHorno: '#0D4D45',
  crema: '#F3E3C2',
  rojoPizza: '#D14B4B',
  negroHorno: '#1A1A1A',
  naranjaFuego: '#FF8F3A',
  white: '#FFFFFF',
};

export const MOCK_MENU: Pizza[] = [
  // PIZZAS CLÁSICAS
  { id: 101, name: 'Americana', description: 'Salsa de tomate + queso mozzarella + jamón + aceitunas verdes.', price: 32.90, category: 'Clásicas', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop' },
  { id: 102, name: 'Hawaina', description: 'Salsa de tomate + queso mozzarella + jamón + piña.', price: 34.90, category: 'Clásicas', imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=800&auto=format&fit=crop' },
  { id: 103, name: 'Pepperoni', description: 'Salsa de tomate + queso mozzarella + pepperoni.', price: 34.90, category: 'Clásicas', imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=800&auto=format&fit=crop' },
  { id: 104, name: 'Margarita', description: 'Salsa de tomate + queso mozzarella + hojas de albahaca + toque aceite de oliva.', price: 30.90, category: 'Clásicas', imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=800&auto=format&fit=crop' },

  // PIZZAS ESPECIALES
  { id: 201, name: 'Meatlover', description: 'Salsa de tomate + mozzarella + pollo + carne + pepperoni + tocino + champiñones + cebolla blanca.', price: 40.90, category: 'Especiales', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop' },
  { id: 202, name: 'Mike\'s', description: 'Salsa de tomate + mozzarella + pollo + jamón + cabanossi + tocino + champiñón + aceituna verde.', price: 40.90, category: 'Especiales', imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop' },
  { id: 203, name: 'Garden', description: 'Salsa de tomate + mozzarella + champiñones + cebolla blanca + pimentón + aceituna verde.', price: 34.90, category: 'Especiales', imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc1671709bdc?q=80&w=800&auto=format&fit=crop' },
  { id: 204, name: 'Chicken BBQ', description: 'Salsa de tomate + mozzarella + pollo + tocino + salsa bbq.', price: 38.90, category: 'Especiales', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop' },
  { id: 205, name: 'Hawaiian Chicken BBQ', description: 'Queso mozzarella + pollo + tocino + piña + salsa bbq.', price: 40.90, category: 'Especiales', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800&auto=format&fit=crop' },
  { id: 206, name: 'Mediterránea', description: 'Salsa de tomate + mozzarella + langostinos + pimentón rojo + aceituna negra.', price: 44.90, category: 'Especiales', imageUrl: 'https://images.unsplash.com/photo-1596458397260-2550cb534066?q=80&w=800&auto=format&fit=crop' },

  // PIZZAS DULCES
  { id: 301, name: 'Chocolatosa', description: 'Nutella, chispas de chocolate, marshmallows y un toque de fudge.', price: 16.90, category: 'Dulces', imageUrl: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=800&auto=format&fit=crop' },
  { id: 302, name: 'Primavera', description: 'Nutella, fresas picadas, marshmallows y un toque de fudge.', price: 17.90, category: 'Dulces', imageUrl: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop' },

  // PASTAS & PLATOS
  { id: 401, name: 'Lasagña', description: 'Salsa bolognesa, bechamell, jamón, queso mozzarella y queso parmesano.', price: 28.90, category: 'Pastas & Platos', imageUrl: 'https://images.unsplash.com/photo-1574868352503-b8d23d16565a?q=80&w=800&auto=format&fit=crop' },
  { id: 402, name: 'Milanesa Napolitana', description: 'Filete de pollo al panko con salsa de tomate, jamón inglés y queso mozzarella. Con papas fritas.', price: 25.90, category: 'Pastas & Platos', imageUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop' },
  { id: 403, name: 'Fetuccini a lo Alfredo', description: 'En salsa blanca con tocino, jamón picado y un toque de parmesano.', price: 33.00, category: 'Pastas & Platos', imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop' },
  { id: 404, name: 'Costillas BBQ (Ribs)', description: 'Costillas de cerdo a la BBQ servidas con papas fritas.', price: 36.00, category: 'Pastas & Platos', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop' },

  // ENTRADAS & CALZONE
  { id: 501, name: 'Calzone Meatlover', description: 'Relleno de carne y quesos.', price: 20.90, category: 'Entradas & Calzone', imageUrl: 'https://images.unsplash.com/photo-1628839828459-073b64700d86?q=80&w=800&auto=format&fit=crop' },
  { id: 502, name: 'Pan al Ajo Especial', description: '6 piezas cubiertas con mantequilla al ajo, queso mozzarella y tocino.', price: 9.90, category: 'Entradas & Calzone', imageUrl: 'https://images.unsplash.com/photo-1573140247632-f84660f67126?q=80&w=800&auto=format&fit=crop' },
  { id: 503, name: 'Alitas BBQ (6 Und)', description: 'Alitas fritas acompañadas de papas fritas.', price: 21.90, category: 'Entradas & Calzone', imageUrl: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?q=80&w=800&auto=format&fit=crop' },

  // POSTRES
  { id: 601, name: 'Profiteroles (4 Und)', description: 'Rellenos de crema.', price: 10.90, category: 'Postres', imageUrl: 'https://images.unsplash.com/photo-1599343063548-2624dfdf44b4?q=80&w=800&auto=format&fit=crop' },
  { id: 602, name: 'Tiramisu', description: 'Clásico postre italiano.', price: 16.00, category: 'Postres', imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop' },
  { id: 603, name: 'Torta de Chocolate', description: 'Porción generosa.', price: 16.00, category: 'Postres', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop' },

  // BEBIDAS
  { id: 701, name: 'Inca Kola / Coca Cola 1.5L', description: 'Gaseosa familiar.', price: 12.00, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop' },
  { id: 702, name: 'Chicha Morada 1L', description: 'Bebida natural.', price: 14.00, category: 'Bebidas', imageUrl: 'https://images.unsplash.com/photo-1605335939886-c357731f24d1?q=80&w=800&auto=format&fit=crop' },
  { id: 703, name: 'Sangría 1L', description: 'Vino con frutas.', price: 30.00, category: 'Tragos', imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop' },
  { id: 704, name: 'Piqueo Mike\'s', description: '6 alitas, papas fritas, 6 chicken fingers, 6 alitas buffalo, 6 rolls pepperoni.', price: 60.00, category: 'Entradas & Calzone', imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop' },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 1, title: 'Fallo en Horno 2', description: 'El termostato no responde, temperatura fija en 180°C.', status: IncidentStatus.OPEN, priority: IncidentPriority.HIGH, responsible: 'Juan T.', createdAt: '2023-10-25' },
  { id: 2, title: 'Error en POS', description: 'No imprime tickets de venta.', status: IncidentStatus.IN_PROGRESS, priority: IncidentPriority.MEDIUM, responsible: 'Maria L.', createdAt: '2023-10-24' },
  { id: 3, title: 'Actualización Carta Web', description: 'Agregar nuevas promociones de verano.', status: IncidentStatus.CLOSED, priority: IncidentPriority.LOW, responsible: 'Admin', createdAt: '2023-10-20', closedAt: '2023-10-22' },
];


