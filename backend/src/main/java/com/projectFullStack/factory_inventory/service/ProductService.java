package com.projectFullStack.factory_inventory.service;

import com.projectFullStack.factory_inventory.dto.ProductDTO;
import com.projectFullStack.factory_inventory.model.Product;
import com.projectFullStack.factory_inventory.model.ProductRawMaterial;
import com.projectFullStack.factory_inventory.repository.ProductRawMaterialRepository;
import com.projectFullStack.factory_inventory.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductRawMaterialRepository productRawMaterialRepository;

    public ProductService(ProductRepository productRepository, ProductRawMaterialRepository productRawMaterialRepository) {
        this.productRepository = productRepository;
        this.productRawMaterialRepository = productRawMaterialRepository;
    }

    public ProductDTO create(ProductDTO dto) {
        Product p = Product.builder()
                .code(dto.getCode())
                .name(dto.getName())
                .price(dto.getPrice())
                .build();
        Product saved = productRepository.save(p);
        dto.setId(saved.getId());
        return dto;
    }

    public Optional<ProductDTO> findById(Long id) {
        return productRepository.findById(id).map(this::toDto);
    }

    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public Optional<ProductDTO> update(Long id, ProductDTO dto) {
        return productRepository.findById(id).map(p -> {
            p.setCode(dto.getCode());
            p.setName(dto.getName());
            p.setPrice(dto.getPrice());
            productRepository.save(p);
            return toDto(p);
        });
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    public List<ProductDTO> findProducibleProducts() {
        // A product is producible if for every required raw material, stockQuantity >= requiredQuantity
        List<Product> products = productRepository.findAll();
        return products.stream().filter(p -> {
            for (ProductRawMaterial prm : p.getProductRawMaterials()) {
                if (prm.getRawMaterial().getStockQuantity().compareTo(prm.getRequiredQuantity()) < 0) {
                    return false;
                }
            }
            return true;
        }).map(this::toDto).collect(Collectors.toList());
    }

    private ProductDTO toDto(Product p) {
        return ProductDTO.builder()
                .id(p.getId())
                .code(p.getCode())
                .name(p.getName())
                .price(p.getPrice())
                .build();
    }
}

