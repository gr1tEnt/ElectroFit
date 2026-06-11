package com.electricalstore.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

import com.electricalstore.dto.ConfiguratorSetResponse;
import com.electricalstore.dto.ProductResponse;
import com.electricalstore.entity.Brand;
import com.electricalstore.entity.Category;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ConfiguratorServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductResponseMapper productResponseMapper;

    @InjectMocks
    private ConfiguratorService configuratorService;

    private Brand valenaLife;
    private Category sockets;
    private Product frame3Post;
    private Product doubleSocket;
    private Product singleSocket;

    @BeforeEach
    void setUp() {
        valenaLife = Brand.builder().id(1L).name("Legrand").seriesName("Valena Life").build();
        sockets = Category.builder().id(10L).name("Sockets").build();

        frame3Post = Product.builder()
                .id(100L)
                .sku("FRM-VL-3P")
                .name("Valena Life 3-post frame")
                .price(new BigDecimal("18.60"))
                .type(ProductType.FRAME)
                .brand(valenaLife)
                .build();

        doubleSocket = Product.builder()
                .id(200L)
                .sku("SKT-VL-IP20-2P")
                .name("Valena Life double socket IP20")
                .price(new BigDecimal("18.90"))
                .type(ProductType.MECHANISM)
                .brand(valenaLife)
                .category(sockets)
                .build();

        singleSocket = Product.builder()
                .id(201L)
                .sku("SKT-VL-IP20-1P")
                .name("Valena Life single socket IP20")
                .price(new BigDecimal("12.50"))
                .type(ProductType.MECHANISM)
                .brand(valenaLife)
                .category(sockets)
                .build();
    }

    @Test
    void findCompatibleSets_usesSingleSocketNotDouble() {
        when(productRepository.findFramesByFramePostsCount(3)).thenReturn(List.of(frame3Post));
        when(productRepository.findMechanismsByBrandSeriesAndCategory(1L, "Valena Life", "Sockets"))
                .thenReturn(List.of(doubleSocket, singleSocket));
        when(productResponseMapper.toResponses(anyList()))
                .thenAnswer(invocation -> {
                    List<Product> products = invocation.getArgument(0);
                    return products.stream()
                            .map(p -> ProductResponse.from(p, null))
                            .toList();
                });

        List<ConfiguratorSetResponse> sets = configuratorService.findCompatibleSets(3, "Sockets");

        assertThat(sets).hasSize(1);
        ConfiguratorSetResponse set = sets.get(0);
        assertThat(set.mechanism().sku()).isEqualTo("SKT-VL-IP20-1P");
        assertThat(set.mechanism().name()).isEqualTo("Valena Life single socket IP20");
        assertThat(set.mechanismQuantity()).isEqualTo(3);
        assertThat(set.setPrice()).isEqualByComparingTo(new BigDecimal("56.10")); // 18.60 + 3×12.50
    }

    @Test
    void findCompatibleSets_skipsFrameWhenOnlyDoubleSocketAvailable() {
        when(productRepository.findFramesByFramePostsCount(3)).thenReturn(List.of(frame3Post));
        when(productRepository.findMechanismsByBrandSeriesAndCategory(1L, "Valena Life", "Sockets"))
                .thenReturn(List.of(doubleSocket));

        List<ConfiguratorSetResponse> sets = configuratorService.findCompatibleSets(3, "Sockets");

        assertThat(sets).isEmpty();
    }
}
