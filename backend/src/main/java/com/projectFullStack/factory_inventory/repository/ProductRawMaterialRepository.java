package com.projectFullStack.factory_inventory.repository;

import com.projectFullStack.factory_inventory.model.ProductRawMaterial;
import com.projectFullStack.factory_inventory.model.ProductRawMaterialId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRawMaterialRepository extends JpaRepository<ProductRawMaterial, ProductRawMaterialId> {
    List<ProductRawMaterial> findByProduct_Id(Long productId);

    @Query("SELECT prm FROM ProductRawMaterial prm JOIN FETCH prm.rawMaterial WHERE prm.id.productId = :productId")
    List<ProductRawMaterial> findByProductIdWithRawMaterial(@Param("productId") Long productId);
    List<ProductRawMaterial> findByProduct_IdIn(List<Long> productIds);
}

