export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number; 
  priceGrande?: number; 
  imageUrl: string;
  category: string; 
}

export interface Reservation {
  id?: number;
  name: string;
  date: string;
  time: string;
  people: number;
  message: string;
  telefono: string;
}

export enum IncidentStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Proceso',
  CLOSED = 'Cerrado'
}

export enum IncidentPriority {
  HIGH = 'Alta',
  MEDIUM = 'Media',
  LOW = 'Baja'
}

export interface Incident {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  responsible: string;
  createdAt: string;
  closedAt?: string;
}

export const WHATSAPP_NUMBER = "51912077181";