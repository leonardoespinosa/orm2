import { Item } from './item.model';

/**
 * Quotation Model
 */
export interface Quotation {
    id?: string;
    id_solicitud?: string;
    client?: string;
    countProffers: number;
    createdAtSolicitud?: Date;
    dataItems?: Item[];
    dateFinish?: string;
    file?: string;
    habilities: any[];
    haveDateContrato: boolean;
    maxPropuestas: number;
    nacional: boolean;
    name?: string;
    nameRequest?: string;
    pago?: Payment;
    peso?: Weight;
    questions?: Question;
    sendForm: string;
    statusSolicitud?: string;
    timeCategoryFeatured?: number;
    timeToFeatured?: Date;
    timestart?: string;
    tokenContratante?: string;
    tokenSolicitud?: string;
    urgentDateEntrega?: string;
    username?: string;
}

/**
 * Payment Model
 */
export interface Payment {
    "En 30 días": number;
    "En 60 días": number;
    "En 90 días": number;
    "anticipo": number;
    "pagoentrega": number;
    "mediopago": string;
}

/**
 * Weight Model
 */
export interface Weight {
    calidad: WeightDetail;
    calificacion: WeightDetail;
    experiencia: WeightDetail;
    formapago: WeightDetail;
    tiempoentrega: WeightDetail;
    valueProffer: WeightDetail;
}

/**
 * WeightDetail Model
 */
export interface WeightDetail {
    status: boolean;
    text: string;
    value: string
}

/**
 * Question Model
 */
export interface Question {
    "Descripción del requerimiento": string;
    "propous": string
}