package com.projectFullStack.factory_inventory.controller;

import com.projectFullStack.factory_inventory.model.ProductRawMaterial;
import com.projectFullStack.factory_inventory.service.ProductRawMaterialService;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products/{productId}/materials")
public class ProductRawMaterialController {

    private final ProductRawMaterialService service;

    public ProductRawMaterialController(ProductRawMaterialService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Void> associate(@PathVariable Long productId,
                                          @RequestParam @NotNull Long rawMaterialId,
                                          @RequestParam @NotNull @DecimalMin("0.0001") BigDecimal requiredQuantity) {
        service.associate(productId, rawMaterialId, requiredQuantity);
        return ResponseEntity.created(URI.create("/api/products/" + productId + "/materials")).build();
    }

    @GetMapping
    public List<?> list(@PathVariable Long productId) {
        return service.listByProduct(productId).stream().map(prm -> {
            return new Object() {
                public final Long rawMaterialId = prm.getRawMaterial().getId();
                public final String rawMaterialCode = prm.getRawMaterial().getCode();
                public final String rawMaterialName = prm.getRawMaterial().getName();
                public final BigDecimal requiredQuantity = prm.getRequiredQuantity();
            };
        }).collect(Collectors.toList());
    }

    @DeleteMapping
    public ResponseEntity<Void> disassociate(@PathVariable Long productId, @RequestParam Long rawMaterialId) {
        service.disassociate(productId, rawMaterialId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Void> updateQuantity(@PathVariable Long productId, @RequestParam Long rawMaterialId, @RequestParam @DecimalMin("0.0001") BigDecimal requiredQuantity) {
        service.updateRequiredQuantity(productId, rawMaterialId, requiredQuantity);
        return ResponseEntity.noContent().build();
    }
}

