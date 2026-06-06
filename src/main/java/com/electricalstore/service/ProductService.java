package com.electricalstore.service;

import com.electricalstore.dto.CreateProductRequest;
import com.electricalstore.dto.UpdateProductRequest;
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
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SmartSelectionService smartSelectionService;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final TechnicalSpecRepository technicalSpecRepository;
    private final ProductImageStorageService productImageStorageService;

    public ProductService(
            ProductRepository productRepository,
            SmartSelectionService smartSelectionService,
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            TechnicalSpecRepository technicalSpecRepository,
            ProductImageStorageService productImageStorageService) {
        this.productRepository = productRepository;
        this.smartSelectionService = smartSelectionService;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.technicalSpecRepository = technicalSpecRepository;
        this.productImageStorageService = productImageStorageService;
    }

    @Transactional(readOnly = true)
    public Product findProductById(Long id) {
        return productRepository
                .findByIdWithDetails(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Product> findProducts(String brand, String series, String category, String search) {
        if (!StringUtils.hasText(brand)
                && !StringUtils.hasText(series)
                && !StringUtils.hasText(category)
                && !StringUtils.hasText(search)) {
            return productRepository.findAll();
        }
        return productRepository.findAll(ProductSpecifications.withFilters(brand, series, category, search));
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
    public Product createProduct(CreateProductRequest request, MultipartFile imageFile) {
        if (productRepository.findBySku(request.sku()).isPresent()) {
            throw new IllegalArgumentException("SKU already exists: " + request.sku());
        }

        Brand brand = resolveBrand(request.brandName(), request.seriesName());
        Category category = resolveCategory(request.categoryName());

        List<String> imageUrls = resolveImageUrlsForCreate(request.imageUrls(), request.imageUrl());
        if (imageFile != null && !imageFile.isEmpty()) {
            String savedPath = productImageStorageService.store(imageFile);
            imageUrls = List.of(savedPath);
        }
        Product product = productRepository.save(Product.builder()
                .sku(request.sku().trim())
                .name(request.name().trim())
                .description(request.description())
                .price(request.price())
                .imageUrl(imageUrls.isEmpty() ? null : imageUrls.get(0))
                .imageUrls(new ArrayList<>(imageUrls))
                .detailedAttributes(new LinkedHashMap<>(resolveDetailedAttributes(request.detailedAttributes())))
                .type(request.type())
                .brand(brand)
                .category(category)
                .lowVoltage(request.lowVoltage())
                .build());

        technicalSpecRepository.save(buildTechnicalSpec(product, request));

        return product;
    }

    @Transactional
    public Product updateProduct(Long id, UpdateProductRequest request) {
        Product product = findProductById(id);

        productRepository
                .findBySku(request.sku().trim())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new IllegalArgumentException("SKU already exists: " + request.sku());
                });

        Brand brand = resolveBrand(request.brandName(), request.seriesName());
        Category category = resolveCategory(request.categoryName());

        List<String> imageUrls = resolveImageUrlsForCreate(request.imageUrls(), request.imageUrl());
        product.setSku(request.sku().trim());
        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(imageUrls.isEmpty() ? null : imageUrls.get(0));
        product.setImageUrls(new ArrayList<>(imageUrls));
        product.setDetailedAttributes(new LinkedHashMap<>(resolveDetailedAttributes(request.detailedAttributes())));
        product.setType(request.type());
        product.setBrand(brand);
        product.setCategory(category);
        product.setLowVoltage(request.lowVoltage());

        TechnicalSpec spec = technicalSpecRepository
                .findByProductId(id)
                .orElseGet(() -> TechnicalSpec.builder().product(product).build());
        applyTechnicalSpec(spec, product, request);
        technicalSpecRepository.save(spec);

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        technicalSpecRepository.findByProductId(id).ifPresent(technicalSpecRepository::delete);
        productRepository.delete(product);
    }

    private Brand resolveBrand(String brandName, String seriesName) {
        return brandRepository
                .findByNameIgnoreCaseAndSeriesNameIgnoreCase(brandName, seriesName)
                .orElseGet(() -> brandRepository.save(Brand.builder()
                        .name(brandName.trim())
                        .seriesName(seriesName.trim())
                        .build()));
    }

    private Category resolveCategory(String categoryName) {
        return categoryRepository
                .findByName(categoryName.trim())
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .name(categoryName.trim())
                        .build()));
    }

    private static Map<String, String> resolveDetailedAttributes(Map<String, String> attributes) {
        if (attributes == null || attributes.isEmpty()) {
            return Map.of();
        }
        Map<String, String> resolved = new LinkedHashMap<>();
        attributes.forEach((key, value) -> {
            if (StringUtils.hasText(key) && value != null) {
                resolved.put(key.trim(), value.trim());
            }
        });
        return resolved;
    }

    private TechnicalSpec buildTechnicalSpec(Product product, CreateProductRequest request) {
        TechnicalSpec spec = TechnicalSpec.builder().product(product).build();
        applyTechnicalSpec(spec, product, request);
        return spec;
    }

    private void applyTechnicalSpec(
            TechnicalSpec spec, Product product, CreateProductRequest request) {
        spec.setIpRating(request.ipRating());
        spec.setMaxAmps(request.maxAmps());
        spec.setHasChildProtection(request.hasChildProtection());
        spec.setHasGrounding(request.hasGrounding());
        spec.setFramePostsCount(request.type() == ProductType.FRAME ? request.framePostsCount() : null);
        spec.setCompatibleRoomTypes(request.compatibleRoomTypes().stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .toList());
    }

    private void applyTechnicalSpec(
            TechnicalSpec spec, Product product, UpdateProductRequest request) {
        spec.setProduct(product);
        spec.setIpRating(request.ipRating());
        spec.setMaxAmps(request.maxAmps());
        spec.setHasChildProtection(request.hasChildProtection());
        spec.setHasGrounding(request.hasGrounding());
        spec.setFramePostsCount(request.type() == ProductType.FRAME ? request.framePostsCount() : null);
        spec.setCompatibleRoomTypes(request.compatibleRoomTypes().stream()
                .map(String::trim)
                .map(String::toUpperCase)
                .toList());
    }

    private static List<String> resolveImageUrlsForCreate(List<String> imageUrls, String imageUrl) {
        if (imageUrls != null && !imageUrls.isEmpty()) {
            return imageUrls.stream()
                    .filter(StringUtils::hasText)
                    .map(String::trim)
                    .toList();
        }
        if (StringUtils.hasText(imageUrl)) {
            return List.of(imageUrl.trim());
        }
        return List.of();
    }
}
