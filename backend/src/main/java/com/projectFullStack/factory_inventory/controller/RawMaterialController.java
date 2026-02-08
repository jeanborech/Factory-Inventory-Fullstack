package com.projectFullStack.factory_inventory.controller;

import com.projectFullStack.factory_inventory.dto.RawMaterialDTO;
import com.projectFullStack.factory_inventory.service.RawMaterialService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/raw-materials")
public class RawMaterialController {

    private final RawMaterialService rawMaterialService;

    public RawMaterialController(RawMaterialService rawMaterialService) {
        this.rawMaterialService = rawMaterialService;
    }

    @PostMapping
    public ResponseEntity<RawMaterialDTO> create(@RequestBody @Valid RawMaterialDTO dto) {
        RawMaterialDTO created = rawMaterialService.create(dto);
        return ResponseEntity.created(URI.create("/api/raw-materials/" + created.getId())).body(created);
    }

    @GetMapping
    public List<RawMaterialDTO> list() {
        return rawMaterialService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RawMaterialDTO> get(@PathVariable Long id) {
        return rawMaterialService.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RawMaterialDTO> update(@PathVariable Long id, @RequestBody @Valid RawMaterialDTO dto) {
        return rawMaterialService.update(id, dto).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        rawMaterialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

