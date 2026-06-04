package com.electricalstore.service;

import com.electricalstore.dto.CreateProductRequest;
import com.electricalstore.entity.Brand;
import com.electricalstore.entity.Category;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.entity.TechnicalSpec;
import com.electricalstore.repository.BrandRepository;
import com.electricalstore.repository.CategoryRepository;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.TechnicalSpecRepository;
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
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final TechnicalSpecRepository technicalSpecRepository;

    public ProductService(
            ProductRepository productRepository,
            SmartSelectionService smartSelectionService,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            TechnicalSpecRepository technicalSpecRepository) {
        this.productRepository = productRepository;
        this.smartSelectionService = smartSelectionService;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.technicalSpecRepository = technicalSpecRepository;
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

    @Transactional
    public Product createProduct(CreateProductRequest request) {
        if (productRepository.findBySku(request.sku()).isPresent()) {
            throw new IllegalArgumentException("SKU already exists: " + request.sku());
        }

        Brand brand = brandRepository
                .findByNameIgnoreCaseAndSeriesNameIgnoreCase(request.brandName(), request.seriesName())
                .orElseGet(() -> brandRepository.save(Brand.builder()
                        .name(request.brandName().trim())
                        .seriesName(request.seriesName().trim())
                        .build()));

        Category category = categoryRepository
                .findByName(request.categoryName().trim())
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(request.categoryName().trim())
                        .build()));

        Product product = productRepository.save(Product.builder()
                .sku(request.sku().trim())
                .name(request.name().trim())
                .description(request.description())
                .price(request.price())
                .imageUrl(request.imageUrl())
                .type(request.type())
                .brand(brand)
                .category(category)
                .lowVoltage(request.lowVoltage())
                .build());

        technicalSpecRepository.save(TechnicalSpec.builder()
                .product(product)
                .ipRating(request.ipRating())
                .maxAmps(request.maxAmps())
                .hasChildProtection(request.hasChildProtection())
                .hasGrounding(request.hasGrounding())
                .framePostsCount(request.type() == ProductType.FRAME ? request.framePostsCount() : null)
                .compatibleRoomTypes(request.compatibleRoomTypes().stream()
                        .map(String::trim)
                        .map(String::toUpperCase)
                        .toList())
                .build());

        return product;
    }
}
