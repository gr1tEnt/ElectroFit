package com.electricalstore.repository;

import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySku(String sku);

    List<Product> findByType(ProductType type);
}
