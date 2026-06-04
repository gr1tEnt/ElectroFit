package com.electricalstore.repository;

import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.TechnicalSpec;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TechnicalSpecRepository extends JpaRepository<TechnicalSpec, Long> {

    Optional<TechnicalSpec> findByProductId(Long productId);

    List<TechnicalSpec> findByIpRating(IpRating ipRating);
}
