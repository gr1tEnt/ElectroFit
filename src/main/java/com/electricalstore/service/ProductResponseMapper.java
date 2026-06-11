package com.electricalstore.service;

import com.electricalstore.dto.ProductResponse;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.TechnicalSpec;
import com.electricalstore.repository.TechnicalSpecRepository;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component
public class ProductResponseMapper {

    private final TechnicalSpecRepository technicalSpecRepository;

    public ProductResponseMapper(TechnicalSpecRepository technicalSpecRepository) {
        this.technicalSpecRepository = technicalSpecRepository;
    }

    public ProductResponse toResponse(Product product) {
        TechnicalSpec spec =
                technicalSpecRepository.findByProductId(product.getId()).orElse(null);
        return ProductResponse.from(product, spec);
    }

    public List<ProductResponse> toResponses(List<Product> products) {
        Map<Long, TechnicalSpec> specsByProductId = technicalSpecRepository.findAll().stream()
                .collect(Collectors.toMap(spec -> spec.getProduct().getId(), Function.identity(), (a, b) -> a));

        return products.stream()
                .map(product -> ProductResponse.from(product, specsByProductId.get(product.getId())))
                .toList();
    }
}
