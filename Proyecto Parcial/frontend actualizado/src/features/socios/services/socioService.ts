import { apiClient } from '../../../api/apiClient';
import type { Socio } from '../models/Socio';
import type { SocioFormData } from '../types/SocioFormData';

export function getSocios(signal?: AbortSignal): Promise<Socio[]> {
    return apiClient.get<Socio[]>('/socios', signal);
}

export function createSocio(data: SocioFormData): Promise<Socio> {
    return apiClient.post<Socio>('/socios', {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
    });
}

export function updateSocio(id: number, data: SocioFormData): Promise<Socio> {
    return apiClient.put<Socio>(`/socios/${id}`, {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
    });
}

export function deleteSocio(id: number): Promise<void> {
    return apiClient.delete<void>(`/socios/${id}`);
}