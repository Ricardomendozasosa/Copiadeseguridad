import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { Socio } from '../models/Socio';
import type { SocioFormData } from '../types/SocioFormData';
import { validarSocio, type SocioFormErrors } from '../utils/socioValidation';
import { createSocio, updateSocio } from '../services/socioService';

const initialSocioForm: SocioFormData = {
    nombre: '',
    email: '',
    telefono: '',
};

interface SocioFormProps {
    socioEditando?: Socio | null;
    onSocioGuardado: () => void;
    onCancelarEdicion?: () => void;
}

function SocioForm({ socioEditando, onSocioGuardado, onCancelarEdicion }: SocioFormProps) {
    const [formData, setFormData] = useState<SocioFormData>(initialSocioForm);
    const [errors, setErrors] = useState<SocioFormErrors>({});
    const [mensaje, setMensaje] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (socioEditando) {
            setFormData({
                nombre: socioEditando.nombre,
                email: socioEditando.email,
                telefono: socioEditando.telefono,
            });
        } else {
            setFormData(initialSocioForm);
        }
        setErrors({});
        setMensaje('');
    }, [socioEditando]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje('');

        const validationErrors = validarSocio(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setEnviando(true);
        try {
            if (socioEditando) {
                await updateSocio(socioEditando.id, formData);
                setMensaje('Socio actualizado correctamente.');
            } else {
                await createSocio(formData);
                setMensaje('Socio guardado correctamente.');
                setFormData(initialSocioForm);
            }
            onSocioGuardado();
        } catch {
            setMensaje(
                socioEditando
                    ? 'Ocurrió un error al actualizar el socio.'
                    : 'Ocurrió un error al guardar el socio.'
            );
        } finally {
            setEnviando(false);
        }
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
                <label>
                    Nombre
                    <input name="nombre" value={formData.nombre} onChange={handleChange} />
                    {errors.nombre && <small className="field-error">{errors.nombre}</small>}
                </label>

                <label>
                    Email
                    <input name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <small className="field-error">{errors.email}</small>}
                </label>

                <label>
                    Teléfono
                    <input name="telefono" value={formData.telefono} onChange={handleChange} />
                    {errors.telefono && <small className="field-error">{errors.telefono}</small>}
                </label>
            </div>

            {mensaje && <div className="form-success">{mensaje}</div>}

            <div className="form-actions">
                {socioEditando && (
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
                        ? socioEditando ? 'Actualizando...' : 'Guardando...'
                        : socioEditando ? 'Actualizar socio' : 'Guardar socio'}
                </button>
            </div>
        </form>
    );
}

export default SocioForm;