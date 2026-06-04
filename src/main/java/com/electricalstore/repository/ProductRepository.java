package com.electricalstore.repository;

import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    Optional<Product> findBySku(String sku);

    List<Product> findByType(ProductType type);

    List<Product> findByTypeAndBrand_SeriesNameIgnoreCase(ProductType type, String seriesName);
}
