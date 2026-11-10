package com.fitclub.socio.application.service;

import com.fitclub.socio.domain.exception.SocioNoEncontradoException;
import com.fitclub.socio.domain.model.Socio;
import com.fitclub.socio.application.port.in.SocioUseCase;
import com.fitclub.socio.application.port.out.SocioRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SocioService implements SocioUseCase {

    private final SocioRepositoryPort socioRepositoryPort;

    public SocioService(SocioRepositoryPort socioRepositoryPort) {
        this.socioRepositoryPort = socioRepositoryPort;
    }

    @Override
    @Transactional
    public Socio registrar(Socio socio) {
        return socioRepositoryPort.guardar(socio);
    }

    @Override
    public List<Socio> listar() {
        return socioRepositoryPort.listar();
    }

    @Override
    public Optional<Socio> buscarPorId(Long id) {
        return socioRepositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional
    public Socio actualizar(Long id, Socio socio) {
        Socio existente = socioRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new SocioNoEncontradoException(id));

        existente.setNombre(socio.getNombre());
        existente.setEmail(socio.getEmail());
        existente.setTelefono(socio.getTelefono());

        return socioRepositoryPort.guardar(existente);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        socioRepositoryPort.buscarPorId(id)
                .orElseThrow(() -> new SocioNoEncontradoException(id));
        socioRepositoryPort.eliminarPorId(id);
    }
}