import { MOCK_MENU, MOCK_INCIDENTS, MOCK_ITIL } from '../constants';
import { Pizza, Incident, Reservation, ITILSection } from '../types';

// This simulates the Spring Boot Backend interactions
// In a real scenario, these would be fetch('http://localhost:8080/api/...')

const DELAY = 500;

const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, DELAY);
  });
};

export const PizzaService = {
  getAll: async (): Promise<Pizza[]> => {
    // Real: return fetch('/api/carta').then(res => res.json());
    return simulateApiCall(MOCK_MENU);
  }
};

export const OrderService = {
  createOrder: async (orderItems: string): Promise<boolean> => {
    // Real: return fetch('/api/pedidos', { method: 'POST', body: ... })
    console.log('Order saved to Spring Boot backend:', orderItems);
    return simulateApiCall(true);
  }
};

export const ReservationService = {
  create: async (reservation: Reservation): Promise<Reservation> => {
    const res = await fetch('http://localhost:8080/reservas/crear-reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    });
    return await res.json();
  },
  getAll: async (): Promise<Reservation[]> => {
    const res = await fetch('http://localhost:8080/reservas/listar-reservas');
    return await res.json();
  }
};

export const IncidentService = {
  getAll: async (): Promise<Incident[]> => {
    // Real: return fetch('/api/incidencias').then(res => res.json());
    return simulateApiCall(MOCK_INCIDENTS);
  },
  create: async (incident: Incident): Promise<Incident> => {
    // Real: return fetch('/api/incidencias', { method: 'POST', ... })
    const newIncident = { ...incident, id: Math.floor(Math.random() * 1000) };
    console.log('Incident created in Backend:', newIncident);
    return simulateApiCall(newIncident);
  },
  update: async (incident: Incident): Promise<Incident> => {
      // Real: return fetch(`/api/incidencias/${incident.id}`, { method: 'PUT', ... })
      console.log('Incident updated in Backend:', incident);
      return simulateApiCall(incident);
  }
};

export const ItilService = {
  getAll: async (): Promise<ITILSection[]> => {
    return simulateApiCall(MOCK_ITIL);
  }
};
