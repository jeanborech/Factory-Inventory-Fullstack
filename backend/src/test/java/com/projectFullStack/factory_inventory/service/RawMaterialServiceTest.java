package com.projectFullStack.factory_inventory.service;

import com.projectFullStack.factory_inventory.dto.RawMaterialDTO;
import com.projectFullStack.factory_inventory.model.RawMaterial;
import com.projectFullStack.factory_inventory.repository.RawMaterialRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class RawMaterialServiceTest {

    @Mock
    private RawMaterialRepository rawMaterialRepository;

    @InjectMocks
    private RawMaterialService rawMaterialService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createAndList() {
        RawMaterial saved = RawMaterial.builder().id(1L).code("RM1").name("RM").stockQuantity(new BigDecimal("10.0000")).build();
        when(rawMaterialRepository.save(any(RawMaterial.class))).thenReturn(saved);
        when(rawMaterialRepository.findAll()).thenReturn(List.of(saved));

        RawMaterialDTO dto = RawMaterialDTO.builder().code("RM1").name("RM").stockQuantity(new BigDecimal("10.0000")).build();
        RawMaterialDTO created = rawMaterialService.create(dto);

        assertNotNull(created.getId());
        assertEquals(1L, created.getId());

        var all = rawMaterialService.findAll();
        assertEquals(1, all.size());
    }
}

