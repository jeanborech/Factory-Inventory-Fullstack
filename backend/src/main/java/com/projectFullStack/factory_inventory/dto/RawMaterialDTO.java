package com.projectFullStack.factory_inventory.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RawMaterialDTO {
    private Long id;
    private String code;
    private String name;
    private BigDecimal stockQuantity;
}

