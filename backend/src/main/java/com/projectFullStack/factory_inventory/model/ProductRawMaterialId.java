package com.projectFullStack.factory_inventory.model;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProductRawMaterialId implements Serializable {
    private Long productId;
    private Long rawMaterialId;
}

