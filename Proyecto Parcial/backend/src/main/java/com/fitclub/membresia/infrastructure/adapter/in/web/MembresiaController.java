package com.fitclub.membresia.infrastructure.adapter.in.web;

import com.fitclub.membresia.domain.exception.MembresiaNoEncontradaException;
import com.fitclub.membresia.domain.model.Membresia;
import com.fitclub.membresia.application.port.in.MembresiaUseCase;
import com.fitclub.membresia.infrastructure.adapter.in.web.dto.MembresiaRequestDTO;
import com.fitclub.membresia.infrastructure.adapter.in.web.dto.MembresiaResponseDTO;
import com.fitclub.membresia.infrastructure.adapter.in.web.mapper.MembresiaWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/membresias")
public class MembresiaController {

    private final MembresiaUseCase membresiaUseCase;

    public MembresiaController(MembresiaUseCase membresiaUseCase) {
        this.membresiaUseCase = membresiaUseCase;
    }

    @PostMapping
    public ResponseEntity<MembresiaResponseDTO> crear(@Valid @RequestBody MembresiaRequestDTO request) {
        Membresia guardado = membresiaUseCase.registrar(MembresiaWebMapper.toDomain(request));
        return ResponseEntity.status(201).body(MembresiaWebMapper.toResponseDTO(guardado));
    }

    @GetMapping
    public List<MembresiaResponseDTO> listar() {
        return membresiaUseCase.listar().stream()
                .map(MembresiaWebMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembresiaResponseDTO> buscarPorId(@PathVariable Long id) {
        Membresia membresia = membresiaUseCase.buscarPorId(id)
                .orElseThrow(() -> new MembresiaNoEncontradaException(id));
        return ResponseEntity.ok(MembresiaWebMapper.toResponseDTO(membresia));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembresiaResponseDTO> actualizar(@PathVariable Long id, @Valid @RequestBody MembresiaRequestDTO request) {
        Membresia actualizado = membresiaUseCase.actualizar(id, MembresiaWebMapper.toDomain(request));
        return ResponseEntity.ok(MembresiaWebMapper.toResponseDTO(actualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        membresiaUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}