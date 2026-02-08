package com.projectFullStack.factory_inventory.service;

import com.projectFullStack.factory_inventory.model.*;
import com.projectFullStack.factory_inventory.repository.ProductRawMaterialRepository;
import com.projectFullStack.factory_inventory.repository.ProductRepository;
import com.projectFullStack.factory_inventory.repository.RawMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductRawMaterialService {

    private final ProductRawMaterialRepository prmRepository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductRawMaterialService(ProductRawMaterialRepository prmRepository, ProductRepository productRepository, RawMaterialRepository rawMaterialRepository) {
        this.prmRepository = prmRepository;
        this.productRepository = productRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    public void associate(Long productId, Long rawMaterialId, BigDecimal requiredQuantity) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new IllegalArgumentException("Product not found"));
        RawMaterial rawMaterial = rawMaterialRepository.findById(rawMaterialId).orElseThrow(() -> new IllegalArgumentException("Raw material not found"));
        ProductRawMaterialId id = new ProductRawMaterialId(productId, rawMaterialId);
        ProductRawMaterial prm = ProductRawMaterial.builder()
                .id(id)
                .product(product)
                .rawMaterial(rawMaterial)
                .requiredQuantity(requiredQuantity)
                .build();
        prmRepository.save(prm);
    }

    public void disassociate(Long productId, Long rawMaterialId) {
        ProductRawMaterialId id = new ProductRawMaterialId(productId, rawMaterialId);
        prmRepository.deleteById(id);
    }

    public List<ProductRawMaterial> listByProduct(Long productId) {
        return prmRepository.findByProductIdWithRawMaterial(productId);
    }

    public void updateRequiredQuantity(Long productId, Long rawMaterialId, BigDecimal requiredQuantity) {
        ProductRawMaterialId id = new ProductRawMaterialId(productId, rawMaterialId);
        ProductRawMaterial prm = prmRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Association not found"));
        prm.setRequiredQuantity(requiredQuantity);
        prmRepository.save(prm);
    }
}

