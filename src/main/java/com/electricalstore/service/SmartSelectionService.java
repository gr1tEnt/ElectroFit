package com.electricalstore.service;

import com.electricalstore.entity.Product;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.spec.ProductSpecifications;
import com.electricalstore.selection.SelectionCriteria;
import com.electricalstore.validation.RoomTypes;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SmartSelectionService {

    private final ProductRepository productRepository;

    public SmartSelectionService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> recommendProducts(String roomType, boolean nearWater, boolean hasChildren) {
        String safeRoomType = RoomTypes.requireAllowed(roomType);
        SelectionCriteria criteria = SelectionCriteria.from(safeRoomType, nearWater, hasChildren);
        return productRepository.findAll(ProductSpecifications.forCriteria(criteria));
    }
}
