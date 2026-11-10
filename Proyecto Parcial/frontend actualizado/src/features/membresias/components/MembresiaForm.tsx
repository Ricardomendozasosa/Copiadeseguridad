import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { Membresia } from '../models/Membresia';
import type { MembresiaFormData } from '../types/MembresiaFormData';
import { validarMembresia, type MembresiaFormErrors } from '../utils/membresiaValidation';
import { createMembresia, updateMembresia } from '../services/membresiaService';
import type { Socio } from '../../socios/models/Socio';

const initialMembresiaForm: MembresiaFormData = {
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
    precio: '',
    socioId: '',
};

interface MembresiaFormProps {
    socios: Socio[];
    membresiaEditando?: Membresia | null;
    onMembresiaGuardada: () => void;
    onCancelarEdicion?: () => void;
}

function MembresiaForm({ socios, membresiaEditando, onMembresiaGuardada, onCancelarEdicion }: MembresiaFormProps) {
    const [formData, setFormData] = useState<MembresiaFormData>(initialMembresiaForm);
    const [errors, setErrors] = useState<MembresiaFormErrors>({});
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (membresiaEditando) {
            setFormData({
                tipo: membresiaEditando.tipo,
                fechaInicio: membresiaEditando.fechaInicio,
                fechaFin: membresiaEditando.fechaFin,
                precio: String(membresiaEditando.precio),
                socioId: String(membresiaEditando.socioId),
            });
        } else {
            setFormData(initialMembresiaForm);
        }
        setErrors({});
        setMensaje('');
    }, [membresiaEditando]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje('');

        const validationErrors = validarMembresia(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setEnviando(true);
        try {
            if (membresiaEditando) {
                await updateMembresia(membresiaEditando.id, formData);
                setMensaje('Membresía actualizada correctamente.');
            } else {
                await createMembresia(formData);
                setMensaje('Membresía guardada correctamente.');
                setFormData(initialMembresiaForm);
            }
            onMembresiaGuardada();
        } catch {
            setMensaje(
                membresiaEditando
                    ? 'Ocurrió un error al actualizar la membresía.'
                    : 'Ocurrió un error al guardar la membresía.'
            );
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
                <label>
                    Tipo
                    <select name="tipo" value={formData.tipo} onChange={handleChange}>
                        <option value="">Seleccione un tipo</option>
                        <option value="MENSUAL">Mensual</option>
                        <option value="TRIMESTRAL">Trimestral</option>
                        <option value="ANUAL">Anual</option>
                    </select>
                    {errors.tipo && <small className="field-error">{errors.tipo}</small>}
                </label>

                <label>
                    Precio
                    <input type="number" name="precio" value={formData.precio} onChange={handleChange} />
                    {errors.precio && <small className="field-error">{errors.precio}</small>}
                </label>

                <label>
                    Fecha de inicio
                    <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} />
                    {errors.fechaInicio && <small className="field-error">{errors.fechaInicio}</small>}
                </label>

                <label>
                    Fecha de fin
                    <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} />
                    {errors.fechaFin && <small className="field-error">{errors.fechaFin}</small>}
                </label>

                <label>
                    Socio
                    <select name="socioId" value={formData.socioId} onChange={handleChange}>
                        <option value="">Seleccione un socio</option>
                        {socios.map((socio) => (
                            <option key={socio.id} value={socio.id}>
                                {socio.nombre}
                            </option>
                        ))}
                    </select>
                    {errors.socioId && <small className="field-error">{errors.socioId}</small>}
                </label>
            </div>

            {mensaje && <div className="form-success">{mensaje}</div>}

            <div className="form-actions">
                {membresiaEditando && (
                    <button
                        className="btn btn--secondary"
                        type="button"
                        onClick={onCancelarEdicion}
                        disabled={enviando}
                    >
                        Cancelar
                    </button>
                )}
                <button className="btn btn--primary" type="submit" disabled={enviando}>
                    {enviando
                        ? membresiaEditando ? 'Actualizando...' : 'Guardando...'
                        : membresiaEditando ? 'Actualizar membresía' : 'Guardar membresía'}
                </button>
            </div>
        </form>
    );
}

export default MembresiaForm;