package com.electricalstore.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.electricalstore.dto.ProductResponse;
import com.electricalstore.entity.Brand;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.repository.UserRepository;
import com.electricalstore.security.JwtService;
import com.electricalstore.service.ConfiguratorService;
import com.electricalstore.service.ProductResponseMapper;
import com.electricalstore.service.ProductService;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(
        controllers = ProductController.class,
        excludeAutoConfiguration = SecurityAutoConfiguration.class)
@AutoConfigureMockMvc(addFilters = false)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ProductService productService;

    @MockitoBean
    private ProductResponseMapper productResponseMapper;

    @MockitoBean
    private ConfiguratorService configuratorService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void listProducts_returnsOk() throws Exception {
        Product product = Product.builder()
                .id(1L)
                .sku("FRM-001")
                .name("2-post Frame")
                .price(new BigDecimal("12.00"))
                .type(ProductType.FRAME)
                .brand(Brand.builder().name("Legrand").seriesName("Valena Life").build())
                .build();

        when(productService.findProducts(null, null, null)).thenReturn(List.of(product));
        when(productResponseMapper.toResponses(any())).thenReturn(List.of(ProductResponse.from(product, null)));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].sku").value("FRM-001"))
                .andExpect(jsonPath("$[0].seriesName").value("Valena Life"));
    }

    @Test
    void smartSelect_returnsOk() throws Exception {
        when(productService.recommendProducts(eq("KITCHEN"), eq(false), eq(false)))
                .thenReturn(List.of());

        mockMvc.perform(post("/api/products/smart-select")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(
                                """
                                {"roomType":"KITCHEN","nearWater":false,"hasChildren":false}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void compatibleFrames_returnsOk() throws Exception {
        when(productService.findCompatibleFrames("Valena Life")).thenReturn(List.of());

        mockMvc.perform(get("/api/products/frames/compatible/Valena Life"))
                .andExpect(status().isOk());
    }
}
