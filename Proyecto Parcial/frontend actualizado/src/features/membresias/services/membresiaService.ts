import { apiClient } from '../../../api/apiClient';
import type { Membresia } from '../models/Membresia';
import type { MembresiaFormData } from '../types/MembresiaFormData';

export function getMembresias(signal?: AbortSignal): Promise<Membresia[]> {
    return apiClient.get<Membresia[]>('/membresias', signal);
}

export function createMembresia(data: MembresiaFormData): Promise<Membresia> {
    return apiClient.post<Membresia>('/membresias', {
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        precio: Number(data.precio),
        socioId: Number(data.socioId),
    });
}

export function updateMembresia(id: number, data: MembresiaFormData): Promise<Membresia> {
    return apiClient.put<Membresia>(`/membresias/${id}`, {
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        precio: Number(data.precio),
        socioId: Number(data.socioId),
    });
}

export function deleteMembresia(id: number): Promise<void> {
    return apiClient.delete<void>(`/membresias/${id}`);
}