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

export enum TipoIncidencia {
  PRODUCCION_COCINA = 'PRODUCCION_COCINA',
  PEDIDOS = 'PEDIDOS',
  DELIVERY = 'DELIVERY',
  CAJA_PAGOS = 'CAJA_PAGOS',
  SISTEMA = 'SISTEMA',
  PERSONAL = 'PERSONAL',
  LIMPIEZA_SEGURIDAD = 'LIMPIEZA_SEGURIDAD',
  INFRAESTRUCTURA = 'INFRAESTRUCTURA',
  SEGURIDAD = 'SEGURIDAD',
  ADMINISTRATIVA = 'ADMINISTRATIVA'
}

export enum IncidentStatus {
  ABIERTO = 'ABIERTO',
  EN_PROCESO = 'EN_PROCESO',
  CERRADO = 'CERRADO'
}

export enum IncidentPriority {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAJA = 'BAJA'
}

export interface Incident {
  id: number;
  tipo: TipoIncidencia;
  titulo: string;
  descripcion: string;
  estado: IncidentStatus;
  prioridad: IncidentPriority;
  responsable: string;
  reportadoPorId: number;
  reportadoPorNombre: string;
  creadoPorId: number;
  creadoPorNombre: string;
  fechaCreacion: string;
  fechaCierre: string | null;
}

export const TIPO_INCIDENCIA_DISPLAY: Record<TipoIncidencia, string> = {
  [TipoIncidencia.PRODUCCION_COCINA]: 'Incidencia de Producción (Cocina)',
  [TipoIncidencia.PEDIDOS]: 'Incidencia de Pedidos',
  [TipoIncidencia.DELIVERY]: 'Incidencia de Delivery',
  [TipoIncidencia.CAJA_PAGOS]: 'Incidencia de Caja y Pagos',
  [TipoIncidencia.SISTEMA]: 'Incidencia del Sistema',
  [TipoIncidencia.PERSONAL]: 'Incidencia de Personal',
  [TipoIncidencia.LIMPIEZA_SEGURIDAD]: 'Incidencia de Limpieza & Seguridad Alimentaria',
  [TipoIncidencia.INFRAESTRUCTURA]: 'Incidencia de Infraestructura',
  [TipoIncidencia.SEGURIDAD]: 'Incidencia de Seguridad',
  [TipoIncidencia.ADMINISTRATIVA]: 'Incidencia Administrativa'
};

export const WHATSAPP_NUMBER = "51912077181";