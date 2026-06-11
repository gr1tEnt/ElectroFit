package com.electricalstore.service;

import com.electricalstore.dto.AdminStatsResponse;
import com.electricalstore.repository.BrandRepository;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.SupportMessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final SupportMessageRepository supportMessageRepository;
    private final BrandRepository brandRepository;

    public AdminService(
            ProductRepository productRepository,
            SupportMessageRepository supportMessageRepository,
            BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.supportMessageRepository = supportMessageRepository;
        this.brandRepository = brandRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        return new AdminStatsResponse(
                productRepository.count(),
                supportMessageRepository.count(),
                brandRepository.count());
    }
}
