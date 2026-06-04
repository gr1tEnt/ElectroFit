package com.electricalstore.service;

import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.spec.ProductSpecifications;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SmartSelectionService smartSelectionService;

    public ProductService(ProductRepository productRepository, SmartSelectionService smartSelectionService) {
        this.productRepository = productRepository;
        this.smartSelectionService = smartSelectionService;
    }

    @Transactional(readOnly = true)
    public List<Product> findProducts(String brand, String series, String category) {
        if (!StringUtils.hasText(brand) && !StringUtils.hasText(series) && !StringUtils.hasText(category)) {
            return productRepository.findAll();
        }
        return productRepository.findAll(ProductSpecifications.withFilters(brand, series, category));
    }

    @Transactional(readOnly = true)
    public List<Product> recommendProducts(String roomType, boolean nearWater, boolean hasChildren) {
        return smartSelectionService.recommendProducts(roomType, nearWater, hasChildren);
    }

    @Transactional(readOnly = true)
    public List<Product> findCompatibleFrames(String seriesName) {
        return productRepository.findByTypeAndBrand_SeriesNameIgnoreCase(ProductType.FRAME, seriesName);
    }
}
