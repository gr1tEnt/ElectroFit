package com.electricalstore.service;

import com.electricalstore.dto.AdminStatsResponse;
import com.electricalstore.repository.OrderRepository;
import com.electricalstore.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminService(ProductRepository productRepository, OrderRepository orderRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        return new AdminStatsResponse(productRepository.count(), orderRepository.count());
    }
}
