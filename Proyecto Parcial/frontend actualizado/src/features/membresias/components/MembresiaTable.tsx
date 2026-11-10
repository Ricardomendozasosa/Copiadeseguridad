import type { Membresia } from '../models/Membresia';
import type { Socio } from '../../socios/models/Socio';

interface MembresiaTableProps {
    membresias: Membresia[];
    socios: Socio[];
    onEditar: (membresia: Membresia) => void;
    onEliminar: (membresia: Membresia) => void;
}

function MembresiaTable({ membresias, socios, onEditar, onEliminar }: MembresiaTableProps) {
    const sociosPorId = new Map(socios.map((socio) => [socio.id, socio]));
    return (
        <div className="table-card">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Tipo</th>
                        <th>Socio</th>
                        <th>Fecha de inicio</th>
                        <th>Fecha de fin</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {membresias.map((membresia) => {
                        const socio = sociosPorId.get(membresia.socioId);
                        return (
                            <tr key={membresia.id}>
                                <td>{membresia.tipo}</td>
                                <td>{socio ? socio.nombre : 'Sin socio asociado'}</td>
                                <td>{membresia.fechaInicio}</td>
                                <td>{membresia.fechaFin}</td>
                                <td>{membresia.precio}</td>
                                <td>
                                    <button
                                        className="btn btn--ghost"
                                        type="button"
                                        onClick={() => onEditar(membresia)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn--danger"
                                        type="button"
                                        onClick={() => onEliminar(membresia)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MembresiaTable;