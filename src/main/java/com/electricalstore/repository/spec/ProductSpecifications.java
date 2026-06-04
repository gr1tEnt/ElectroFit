package com.electricalstore.repository.spec;

import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.TechnicalSpec;
import com.electricalstore.selection.SelectionCriteria;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> forCriteria(SelectionCriteria criteria) {
        return (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            if (criteria.lowVoltageOnly()) {
                predicates.add(cb.isTrue(root.get("lowVoltage")));
            }

            boolean needsSpecFilter =
                    (!criteria.lowVoltageOnly() && criteria.minIpRating() > 0)
                            || criteria.requireChildProtection();

            if (needsSpecFilter) {
                predicates.add(root.get("id").in(technicalSpecSubquery(query, cb, criteria)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Subquery<Long> technicalSpecSubquery(
            jakarta.persistence.criteria.CriteriaQuery<?> query,
            jakarta.persistence.criteria.CriteriaBuilder cb,
            SelectionCriteria criteria) {
        Subquery<Long> subquery = query.subquery(Long.class);
        Root<TechnicalSpec> spec = subquery.from(TechnicalSpec.class);
        subquery.select(spec.get("product").get("id"));

        List<Predicate> specPredicates = new ArrayList<>();
        if (!criteria.lowVoltageOnly() && criteria.minIpRating() > 0) {
            specPredicates.add(spec.get("ipRating").in(IpRating.withMinimumRating(criteria.minIpRating())));
        }
        if (criteria.requireChildProtection()) {
            specPredicates.add(cb.isTrue(spec.get("hasChildProtection")));
        }

        subquery.where(specPredicates.toArray(new Predicate[0]));
        return subquery;
    }
}
