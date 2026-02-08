package com.projectFullStack.factory_inventory.service;

import com.projectFullStack.factory_inventory.dto.RawMaterialDTO;
import com.projectFullStack.factory_inventory.model.RawMaterial;
import com.projectFullStack.factory_inventory.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RawMaterialService {

    private final RawMaterialRepository rawMaterialRepository;

    public RawMaterialService(RawMaterialRepository rawMaterialRepository) {
        this.rawMaterialRepository = rawMaterialRepository;
    }

    public RawMaterialDTO create(RawMaterialDTO dto) {
        RawMaterial rm = RawMaterial.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .stockQuantity(dto.getStockQuantity())
                .build();
        RawMaterial saved = rawMaterialRepository.save(rm);
        dto.setId(saved.getId());
        return dto;
    }

    public Optional<RawMaterialDTO> findById(Long id) {
        return rawMaterialRepository.findById(id).map(this::toDto);
    }

    public List<RawMaterialDTO> findAll() {
        return rawMaterialRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<RawMaterialDTO> update(Long id, RawMaterialDTO dto) {
        return rawMaterialRepository.findById(id).map(rm -> {
            rm.setCode(dto.getCode());
            rm.setName(dto.getName());
            rm.setStockQuantity(dto.getStockQuantity());
            rawMaterialRepository.save(rm);
            return toDto(rm);
        });
    }

    public void delete(Long id) {
        rawMaterialRepository.deleteById(id);
    }

    private RawMaterialDTO toDto(RawMaterial rm) {
        return RawMaterialDTO.builder()
                .id(rm.getId())
                .code(rm.getCode())
                .name(rm.getName())
                .stockQuantity(rm.getStockQuantity())
                .build();
    }
}

