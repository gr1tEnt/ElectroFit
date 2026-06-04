package com.electricalstore.repository;

import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"brand", "category", "imageUrls"})
    @Query("SELECT p FROM Product p WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(@Param("id") Long id);

    Optional<Product> findBySku(String sku);

    List<Product> findByType(ProductType type);

    List<Product> findByTypeAndBrand_SeriesNameIgnoreCase(ProductType type, String seriesName);

    @Query(
            """
            SELECT p FROM Product p
            JOIN TechnicalSpec ts ON ts.product = p
            WHERE p.type = com.electricalstore.entity.ProductType.FRAME
            AND ts.framePostsCount = :postsCount
            """)
    List<Product> findFramesByFramePostsCount(@Param("postsCount") int postsCount);

    @Query(
            """
            SELECT p FROM Product p
            WHERE p.type = com.electricalstore.entity.ProductType.MECHANISM
            AND p.brand.id = :brandId
            AND LOWER(p.brand.seriesName) = LOWER(:seriesName)
            AND LOWER(p.category.name) = LOWER(:categoryName)
            """)
    List<Product> findMechanismsByBrandSeriesAndCategory(
            @Param("brandId") Long brandId,
            @Param("seriesName") String seriesName,
            @Param("categoryName") String categoryName);
}
