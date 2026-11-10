import { useState, useEffect, useMemo } from 'react';
import { useMembresias } from '../hooks/useMembresias';
import { useSocios } from '../../socios/hooks/useSocios';
import MembresiaTable from '../components/MembresiaTable';
import MembresiaForm from '../components/MembresiaForm';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { Pagination } from '../../../components/ui/Pagination';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { deleteMembresia } from '../services/membresiaService';
import type { Membresia } from '../models/Membresia';

const PAGE_SIZE = 5;

const TIPOS = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'MENSUAL', label: 'Mensual' },
    { value: 'TRIMESTRAL', label: 'Trimestral' },
    { value: 'ANUAL', label: 'Anual' },
];

function MembresiasPage() {
    const { data: membresias, loading: cargandoMembresias, error: errorMembresias, reload } = useMembresias();
    const { data: socios, loading: cargandoSocios, error: errorSocios } = useSocios();

    const [search, setSearch] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('all');
    const [page, setPage] = useState(1);
    const [membresiaEditando, setMembresiaEditando] = useState<Membresia | null>(null);
    const [membresiaAEliminar, setMembresiaAEliminar] = useState<Membresia | null>(null);
    const [eliminando, setEliminando] = useState(false);
    const [errorEliminar, setErrorEliminar] = useState('');

    const cargando = cargandoMembresias || cargandoSocios;
    const error = errorMembresias || errorSocios;

    const sociosPorId = useMemo(
        () => new Map(socios.map((socio) => [socio.id, socio])),
        [socios],
    );

    const filteredMembresias = membresias.filter((membresia) => {
        const socio = sociosPorId.get(membresia.socioId);
        const term = search.trim().toLowerCase();
        const texto = `${membresia.tipo} ${socio?.nombre ?? ''}`.toLowerCase();
        const matchesText = !term || texto.includes(term);
        const matchesTipo = tipoFiltro === 'all' || membresia.tipo === tipoFiltro;
        return matchesText && matchesTipo;
    });

    const totalPages = Math.max(1, Math.ceil(filteredMembresias.length / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const visibleMembresias = filteredMembresias.slice(start, start + PAGE_SIZE);

    useEffect(() => {
        setPage(1);
    }, [search, tipoFiltro]);

    const handleMembresiaGuardada = () => {
        setMembresiaEditando(null);
        reload();
    };

    const handleEliminarClick = (membresia: Membresia) => {
        setMembresiaAEliminar(membresia);
        setErrorEliminar('');
    };

    const handleCancelarEliminar = () => {
        setMembresiaAEliminar(null);
        setErrorEliminar('');
    };

    const handleConfirmarEliminar = async () => {
        if (!membresiaAEliminar) return;
        setEliminando(true);
        setErrorEliminar('');
        try {
            await deleteMembresia(membresiaAEliminar.id);
            setMembresiaAEliminar(null);
            reload();
        } catch {
            setErrorEliminar('Ocurrió un error al eliminar la membresía.');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="feature-page">
            <h1>Membresías</h1>
            <MembresiaForm
                socios={socios}
                membresiaEditando={membresiaEditando}
                onMembresiaGuardada={handleMembresiaGuardada}
                onCancelarEdicion={() => setMembresiaEditando(null)}
            />
            <SearchInput value={search} onChange={setSearch} placeholder="Buscar por tipo o socio..." />
            <SelectFilter label="Tipo" value={tipoFiltro} options={TIPOS} onChange={setTipoFiltro} />
            {cargando && <p>Cargando membresías...</p>}
            {error && <p>{error}</p>}
            {!cargando && !error && filteredMembresias.length === 0 && (
                <EmptyState title="No se encontraron membresías" description="Prueba con otro término de búsqueda o filtro." />
            )}
            {!cargando && !error && filteredMembresias.length > 0 && (
                <>
                    <MembresiaTable
                        membresias={visibleMembresias}
                        socios={socios}
                        onEditar={setMembresiaEditando}
                        onEliminar={handleEliminarClick}
                    />
                    <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            <ConfirmDialog
                open={membresiaAEliminar !== null}
                title="Eliminar membresía"
                message={`¿Seguro que quieres eliminar esta membresía (${membresiaAEliminar?.tipo})? Esta acción no se puede deshacer.`}
                error={errorEliminar}
                confirmando={eliminando}
                onConfirm={handleConfirmarEliminar}
                onCancel={handleCancelarEliminar}
            />
        </div>
    );
}

export default MembresiasPage;