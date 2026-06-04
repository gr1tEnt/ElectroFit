package com.electricalstore.config;

import com.electricalstore.entity.Brand;
import com.electricalstore.entity.Category;
import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.entity.TechnicalSpec;
import com.electricalstore.repository.BrandRepository;
import com.electricalstore.repository.CategoryRepository;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.TechnicalSpecRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("demo")
public class DemoDataLoader {

    @Bean
    CommandLineRunner loadDemoProducts(
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            TechnicalSpecRepository technicalSpecRepository) {
        return args -> {
            if (productRepository.count() > 0) {
                return;
            }

            Brand legrand = brandRepository.save(Brand.builder()
                    .name("Legrand")
                    .seriesName("Valena Life")
                    .build());

            Category sockets = categoryRepository.save(Category.builder()
                    .name("Sockets")
                    .build());

            Category frames = categoryRepository.save(Category.builder()
                    .name("Frames")
                    .build());

            for (int posts : new int[] {1, 2, 3, 4, 5}) {
                Product frame = productRepository.save(Product.builder()
                        .sku("FRM-VL-" + posts)
                        .name("Valena Life " + posts + "-post frame")
                        .description("Modular frame for " + posts + " mechanisms")
                        .price(new BigDecimal("8.50").multiply(BigDecimal.valueOf(posts)))
                        .type(ProductType.FRAME)
                        .brand(legrand)
                        .category(frames)
                        .build());

                technicalSpecRepository.save(TechnicalSpec.builder()
                        .product(frame)
                        .ipRating(IpRating.IP20)
                        .maxAmps(16)
                        .hasChildProtection(false)
                        .hasGrounding(true)
                        .framePostsCount(posts)
                        .build());
            }

            Product socket = productRepository.save(Product.builder()
                    .sku("SKT-VL-001")
                    .name("Valena Life double socket")
                    .description("2P+E socket mechanism")
                    .price(new BigDecimal("14.99"))
                    .type(ProductType.MECHANISM)
                    .brand(legrand)
                    .category(sockets)
                    .build());

            technicalSpecRepository.save(TechnicalSpec.builder()
                    .product(socket)
                    .ipRating(IpRating.IP44)
                    .maxAmps(16)
                    .hasChildProtection(true)
                    .hasGrounding(true)
                    .build());
        };
    }
}
