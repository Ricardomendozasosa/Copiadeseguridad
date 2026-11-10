package com.fitclub.membresia.application.service;

import com.fitclub.membresia.domain.exception.MembresiaNoEncontradaException;
import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.application.port.in.MembresiaUseCase;
import com.fitclub.membresia.application.port.out.MembresiaRepositoryPort;
import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import com.fitclub.socio.application.port.in.SocioUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MembresiaService implements MembresiaUseCase {

    private final MembresiaRepositoryPort membresiaRepositoryPort;
    private final SocioUseCase socioUseCase;

    public MembresiaService(MembresiaRepositoryPort membresiaRepositoryPort, SocioUseCase socioUseCase) {
        this.membresiaRepositoryPort = membresiaRepositoryPort;
        this.socioUseCase = socioUseCase;
    }

    @Override
    @Transactional
    public Membresia registrar(Membresia membresia) {
        socioUseCase.buscarPorId(membresia.getSocioId())
                .orElseThrow(() -> new SocioNoEncontradoException(membresia.getSocioId()));
        return membresiaRepositoryPort.guardar(membresia);
    }

    @Override
    public List<Membresia> listar() {
        return membresiaRepositoryPort.listar();
    }

    @Override
    public Optional<Membresia> buscarPorId(Long id) {
        return membresiaRepositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional
    public Membresia actualizar(Long id, Membresia membresia) {
        Membresia existente = membresiaRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new MembresiaNoEncontradaException(id));

        socioUseCase.buscarPorId(membresia.getSocioId())
                .orElseThrow(() -> new SocioNoEncontradoException(membresia.getSocioId()));

        existente.setTipo(membresia.getTipo());
        existente.setFechaInicio(membresia.getFechaInicio());
        existente.setFechaFin(membresia.getFechaFin());
        existente.setPrecio(membresia.getPrecio());
        existente.setSocioId(membresia.getSocioId());

        return membresiaRepositoryPort.guardar(existente);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        membresiaRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new MembresiaNoEncontradaException(id));
        membresiaRepositoryPort.eliminarPorId(id);
    }
}