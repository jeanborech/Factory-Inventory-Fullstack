package com.projectFullStack.factory_inventory.service;

import com.projectFullStack.factory_inventory.dto.ProductDTO;
import com.projectFullStack.factory_inventory.model.Product;
import com.projectFullStack.factory_inventory.model.ProductRawMaterial;
import com.projectFullStack.factory_inventory.model.RawMaterial;
import com.projectFullStack.factory_inventory.repository.ProductRawMaterialRepository;
import com.projectFullStack.factory_inventory.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductRawMaterialRepository prmRepository;

    @InjectMocks
    private ProductService productService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProduct_success() {
        Product toSave = Product.builder().code("P1").name("Prod 1").price(new BigDecimal("5.00")).build();
        Product saved = Product.builder().id(1L).code("P1").name("Prod 1").price(new BigDecimal("5.00")).build();
        when(productRepository.save(any(Product.class))).thenReturn(saved);

        ProductDTO dto = ProductDTO.builder().code("P1").name("Prod 1").price(new BigDecimal("5.00")).build();
        ProductDTO result = productService.create(dto);

        assertNotNull(result.getId());
        assertEquals(1L, result.getId());
    }

    @Test
    void findProducibleProducts_filtersCorrectly() {
        RawMaterial rmAvailable = RawMaterial.builder().id(1L).code("RM1").name("RM").stockQuantity(new BigDecimal("10.0000")).build();
        RawMaterial rmLow = RawMaterial.builder().id(2L).code("RM2").name("RM2").stockQuantity(new BigDecimal("0.5000")).build();

        Product p1 = Product.builder().id(1L).code("P1").name("Prod1").price(new BigDecimal("1.00")).build();
        Product p2 = Product.builder().id(2L).code("P2").name("Prod2").price(new BigDecimal("2.00")).build();

        ProductRawMaterial prm1 = ProductRawMaterial.builder().id(null).product(p1).rawMaterial(rmAvailable).requiredQuantity(new BigDecimal("1.0000")).build();
        ProductRawMaterial prm2 = ProductRawMaterial.builder().id(null).product(p2).rawMaterial(rmLow).requiredQuantity(new BigDecimal("1.0000")).build();

        p1.getProductRawMaterials().add(prm1);
        p2.getProductRawMaterials().add(prm2);

        when(productRepository.findAll()).thenReturn(List.of(p1, p2));

        List<ProductDTO> producible = productService.findProducibleProducts();

        assertEquals(1, producible.size());
        assertEquals("P1", producible.get(0).getCode());
    }
}

