import type { Socio } from '../models/Socio';

interface SocioTableProps {
    socios: Socio[];
    onEditar: (socio: Socio) => void;
    onEliminar: (socio: Socio) => void;
}

function SocioTable({ socios, onEditar, onEliminar }: SocioTableProps) {
    return (
        <div className="table-card">
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Fecha de registro</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {socios.map((socio) => (
                        <tr key={socio.id}>
                            <td>{socio.nombre}</td>
                            <td>{socio.email}</td>
                            <td>{socio.telefono}</td>
                            <td>{socio.fechaRegistro}</td>
                            <td>
                                <button
                                    className="btn btn--ghost"
                                    type="button"
                                    onClick={() => onEditar(socio)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn--danger"
                                    type="button"
                                    onClick={() => onEliminar(socio)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SocioTable;