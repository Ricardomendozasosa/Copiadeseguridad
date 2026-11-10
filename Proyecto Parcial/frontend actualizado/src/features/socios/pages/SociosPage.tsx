import { useState, useEffect } from 'react';
import { useSocios } from '../hooks/useSocios';
import SocioTable from '../components/SocioTable';
import SocioForm from '../components/SocioForm';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Pagination } from '../../../components/ui/Pagination';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { deleteSocio } from '../services/socioService';
import type { Socio } from '../models/Socio';

const PAGE_SIZE = 5;

function SociosPage() {
    const { data: socios, loading, error, reload } = useSocios();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [socioEditando, setSocioEditando] = useState<Socio | null>(null);
    const [socioAEliminar, setSocioAEliminar] = useState<Socio | null>(null);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState('');

    const filteredSocios = socios.filter((socio) => {
        const term = search.trim().toLowerCase();
        return (
            !term ||
            socio.nombre.toLowerCase().includes(term) ||
            socio.email.toLowerCase().includes(term)
        );
    });

    const totalPages = Math.max(1, Math.ceil(filteredSocios.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const visibleSocios = filteredSocios.slice(start, start + PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const handleSocioGuardado = () => {
        setSocioEditando(null);
        reload();
    };

    const handleEliminarClick = (socio: Socio) => {
        setSocioAEliminar(socio);
        setErrorEliminar('');
    };

    const handleCancelarEliminar = () => {
        setSocioAEliminar(null);
        setErrorEliminar('');
    };

    const handleConfirmarEliminar = async () => {
        if (!socioAEliminar) return;
        setEliminando(true);
        setErrorEliminar('');
        try {
            await deleteSocio(socioAEliminar.id);
            setSocioAEliminar(null);
            reload();
        } catch (err) {
            const msg = err instanceof Error ? err.message : '';
            if (msg.includes('409')) {
                setErrorEliminar('No se puede eliminar: el socio tiene membresías asociadas.');
            } else {
                setErrorEliminar('Ocurrió un error al eliminar el socio.');
            }
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="feature-page">
            <h1>Socios</h1>
            <SocioForm
                socioEditando={socioEditando}
                onSocioGuardado={handleSocioGuardado}
                onCancelarEdicion={() => setSocioEditando(null)}
            />
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nombre o email..." />
            {loading && <p>Cargando socios...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && filteredSocios.length === 0 && (
                <EmptyState title="No se encontraron socios" description="Prueba con otro término de búsqueda." />
            )}
            {!loading && !error && filteredSocios.length > 0 && (
                <>
                    <SocioTable
                        socios={visibleSocios}
                        onEditar={setSocioEditando}
                        onEliminar={handleEliminarClick}
                    />
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            <ConfirmDialog
                open={socioAEliminar !== null}
                title="Eliminar socio"
                message={`¿Seguro que quieres eliminar a ${socioAEliminar?.nombre}? Esta acción no se puede deshacer.`}
                error={errorEliminar}
                confirmando={eliminando}
                onConfirm={handleConfirmarEliminar}
                onCancel={handleCancelarEliminar}
            />
        </div>
    );
}

export default SociosPage;