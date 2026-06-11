package com.electricalstore.service;

import com.electricalstore.dto.ConfiguratorSetResponse;
import com.electricalstore.dto.ProductResponse;
import com.electricalstore.entity.Product;
import com.electricalstore.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ConfiguratorService {

    private final ProductRepository productRepository;
    private final ProductResponseMapper productResponseMapper;

    public ConfiguratorService(
            ProductRepository productRepository, ProductResponseMapper productResponseMapper) {
        this.productRepository = productRepository;
        this.productResponseMapper = productResponseMapper;
    }

    @Transactional(readOnly = true)
    public List<ConfiguratorSetResponse> findCompatibleSets(int postsCount, String categoryName) {
        if (postsCount < 1 || postsCount > 5) {
            throw new IllegalArgumentException("postsCount must be between 1 and 5");
        }
        if (!StringUtils.hasText(categoryName)) {
            throw new IllegalArgumentException("category is required");
        }

        List<Product> frames = productRepository.findFramesByFramePostsCount(postsCount);
        List<ConfiguratorSetResponse> sets = new ArrayList<>();

        for (Product frame : frames) {
            if (frame.getBrand() == null || !StringUtils.hasText(frame.getBrand().getSeriesName())) {
                continue;
            }

            List<Product> mechanisms = productRepository.findMechanismsByBrandSeriesAndCategory(
                    frame.getBrand().getId(),
                    frame.getBrand().getSeriesName(),
                    categoryName.trim());

            Product mechanism = selectSinglePostMechanism(mechanisms);
            if (mechanism == null) {
                continue;
            }

            List<ProductResponse> mapped = productResponseMapper.toResponses(List.of(frame, mechanism));
            ProductResponse frameResponse = mapped.get(0);
            ProductResponse mechanismResponse = mapped.get(1);

            BigDecimal setPrice = frame.getPrice().add(mechanism.getPrice().multiply(BigDecimal.valueOf(postsCount)));

            sets.add(new ConfiguratorSetResponse(
                    frameResponse,
                    mechanismResponse,
                    postsCount,
                    frame.getBrand().getName(),
                    frame.getBrand().getSeriesName(),
                    setPrice));
        }

        return sets;
    }

    /**
     * Multi-post frames accept one single-post mechanism per slot — never double sockets.
     */
    private Product selectSinglePostMechanism(List<Product> mechanisms) {
        return mechanisms.stream()
                .filter(this::isSinglePostSocketMechanism)
                .findFirst()
                .orElse(null);
    }

    private boolean isSinglePostSocketMechanism(Product mechanism) {
        if (isDoublePostSocketMechanism(mechanism)) {
            return false;
        }
        String sku = mechanism.getSku();
        if (StringUtils.hasText(sku) && sku.toUpperCase().endsWith("-1P")) {
            return true;
        }
        String name = mechanism.getName();
        return StringUtils.hasText(name) && name.toLowerCase().contains("single socket");
    }

    private boolean isDoublePostSocketMechanism(Product mechanism) {
        String sku = mechanism.getSku();
        if (StringUtils.hasText(sku) && sku.toUpperCase().endsWith("-2P")) {
            return true;
        }
        String name = mechanism.getName();
        return StringUtils.hasText(name) && name.toLowerCase().contains("double socket");
    }
}
