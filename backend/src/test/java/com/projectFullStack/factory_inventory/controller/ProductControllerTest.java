package com.projectFullStack.factory_inventory.controller;

import com.projectFullStack.factory_inventory.dto.ProductDTO;
import com.projectFullStack.factory_inventory.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class ProductControllerTest {

    @Test
    void producible_returnsList() {
        ProductService productService = Mockito.mock(ProductService.class);
        ProductDTO p = ProductDTO.builder().id(1L).code("P1").name("Prod1").price(new BigDecimal("1.00")).build();
        when(productService.findProducibleProducts()).thenReturn(List.of(p));

        ProductController controller = new ProductController(productService);
        var res = controller.producible();

        assertEquals(1, res.size());
        assertEquals("P1", res.get(0).getCode());
    }
}

