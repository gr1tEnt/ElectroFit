package com.electricalstore.repository;

import com.electricalstore.entity.Brand;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {

    Optional<Brand> findByName(String name);

    Optional<Brand> findByNameIgnoreCaseAndSeriesNameIgnoreCase(String name, String seriesName);

    List<Brand> findBySeriesName(String seriesName);
}
