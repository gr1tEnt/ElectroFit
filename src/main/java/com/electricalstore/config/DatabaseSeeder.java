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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final TechnicalSpecRepository technicalSpecRepository;

    public DatabaseSeeder(
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            TechnicalSpecRepository technicalSpecRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.technicalSpecRepository = technicalSpecRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            log.info("Database already contains products — skipping seed.");
            return;
        }

        log.info("Seeding electrical store catalog…");

        Brand legrandValena = saveBrand("Legrand", "Valena Life");
        Brand schneiderAsfora = saveBrand("Schneider Electric", "Asfora");

        Category sockets = saveCategory("Sockets");
        Category frames = saveCategory("Frames");
        Category switches = saveCategory("Switches");

        seedBedroomProducts(legrandValena, schneiderAsfora, sockets, frames);
        seedBathroomProducts(legrandValena, schneiderAsfora, sockets);
        seedKidsRoomProducts(legrandValena, schneiderAsfora, sockets);
        seedOutdoorProducts(legrandValena, schneiderAsfora, sockets, switches);
        seedKitchenProducts(legrandValena, sockets);

        log.info("Seeded {} products.", productRepository.count());
    }

    private void seedBedroomProducts(Brand legrand, Brand schneider, Category sockets, Category frames) {
        saveMechanism(
                "SKT-VL-IP20-2P",
                "Valena Life double socket IP20",
                "Standard 2P+E socket for dry rooms (bedroom, living room).",
                "18.90",
                legrand,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP20)
                        .maxAmps(16)
                        .hasChildProtection(false)
                        .hasGrounding(true));

        saveMechanism(
                "SKT-VL-IP20-1P",
                "Valena Life single socket IP20",
                "Single outlet for bedside or desk circuits.",
                "12.50",
                legrand,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(16).hasChildProtection(false).hasGrounding(true));

        saveMechanism(
                "SKT-AF-IP20-2P",
                "Asfora double socket IP20",
                "Schneider Asfora modular socket for dry interior zones.",
                "16.40",
                schneider,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(16).hasChildProtection(false).hasGrounding(true));

        for (int posts : new int[] {1, 2, 3, 4, 5}) {
            saveFrame(
                    "FRM-VL-" + posts + "P",
                    "Valena Life " + posts + "-post frame",
                    "IP20 modular frame for " + posts + " mechanism(s).",
                    BigDecimal.valueOf(6.20 * posts),
                    legrand,
                    frames,
                    posts);
        }

        for (int posts : new int[] {1, 2, 3}) {
            saveFrame(
                    "FRM-AF-" + posts + "P",
                    "Asfora " + posts + "-post frame",
                    "Asfora series frame, " + posts + " gangs.",
                    BigDecimal.valueOf(5.80 * posts),
                    schneider,
                    frames,
                    posts);
        }
    }

    private void seedBathroomProducts(Brand legrand, Brand schneider, Category sockets) {
        saveMechanism(
                "SKT-VL-IP44-SPL",
                "Valena Life socket IP44 with splash cover",
                "Splash-protected socket for bathroom zone 3 (away from water).",
                "24.50",
                legrand,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP44)
                        .maxAmps(16)
                        .hasChildProtection(false)
                        .hasGrounding(true));

        saveMechanism(
                "SKT-AF-IP44-SPL",
                "Asfora socket IP44 with splash cover",
                "Asfora IP44 mechanism with integrated splash protection.",
                "22.10",
                schneider,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP44).maxAmps(16).hasChildProtection(false).hasGrounding(true));

        saveMechanism(
                "SKT-VL-SELV-12V",
                "Valena Life 12V SELV shaver socket",
                "Low-voltage outlet for bathroom zones 1–2 within 60 cm of water.",
                "31.00",
                legrand,
                sockets,
                true,
                spec -> spec.ipRating(IpRating.IP44).maxAmps(3).hasChildProtection(false).hasGrounding(false));
    }

    private void seedKidsRoomProducts(Brand legrand, Brand schneider, Category sockets) {
        saveMechanism(
                "SKT-VL-KIDS",
                "Valena Life socket with child protection",
                "Shuttered child-protection socket for kids rooms.",
                "21.90",
                legrand,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP20)
                        .maxAmps(16)
                        .hasChildProtection(true)
                        .hasGrounding(true));

        saveMechanism(
                "SKT-AF-KIDS",
                "Asfora socket with child protection",
                "Asfora mechanism with integrated child safety shutters.",
                "19.70",
                schneider,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(16).hasChildProtection(true).hasGrounding(true));
    }

    private void seedOutdoorProducts(
            Brand legrand, Brand schneider, Category sockets, Category switches) {
        saveMechanism(
                "SW-VL-IP65",
                "Valena Life weatherproof switch IP65",
                "Heavy-duty exterior switch for gardens and exposed walls.",
                "28.40",
                legrand,
                switches,
                false,
                spec -> spec.ipRating(IpRating.IP65).maxAmps(20).hasChildProtection(false).hasGrounding(true));

        saveMechanism(
                "SW-AF-IP55",
                "Asfora weatherproof switch IP55",
                "Outdoor-rated switch for garages and covered patios.",
                "26.20",
                schneider,
                switches,
                false,
                spec -> spec.ipRating(IpRating.IP55).maxAmps(20).hasChildProtection(false).hasGrounding(true));

        saveMechanism(
                "SKT-AF-IP54-OUT",
                "Asfora outdoor socket IP54",
                "Surface-mounted weather-resistant socket.",
                "34.80",
                schneider,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP54).maxAmps(16).hasChildProtection(false).hasGrounding(true));
    }

    private void seedKitchenProducts(Brand legrand, Category sockets) {
        saveMechanism(
                "SKT-VL-IP44-KIT",
                "Valena Life kitchen socket IP44",
                "Splash-resistant socket for kitchen work zones near sinks.",
                "23.60",
                legrand,
                sockets,
                false,
                spec -> spec.ipRating(IpRating.IP44).maxAmps(16).hasChildProtection(false).hasGrounding(true));
    }

    private Brand saveBrand(String name, String series) {
        return brandRepository.save(Brand.builder().name(name).seriesName(series).build());
    }

    private Category saveCategory(String name) {
        return categoryRepository.save(Category.builder().name(name).build());
    }

    private void saveFrame(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Brand brand,
            Category category,
            int posts) {
        Product frame = productRepository.save(Product.builder()
                .sku(sku)
                .name(name)
                .description(description)
                .price(price)
                .type(ProductType.FRAME)
                .brand(brand)
                .category(category)
                .lowVoltage(false)
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

    private void saveMechanism(
            String sku,
            String name,
            String description,
            String price,
            Brand brand,
            Category category,
            boolean lowVoltage,
            java.util.function.Function<TechnicalSpec.TechnicalSpecBuilder, TechnicalSpec.TechnicalSpecBuilder> specCustomizer) {
        Product product = productRepository.save(Product.builder()
                .sku(sku)
                .name(name)
                .description(description)
                .price(new BigDecimal(price))
                .type(ProductType.MECHANISM)
                .brand(brand)
                .category(category)
                .lowVoltage(lowVoltage)
                .build());

        TechnicalSpec.TechnicalSpecBuilder specBuilder = TechnicalSpec.builder().product(product);
        technicalSpecRepository.save(specCustomizer.apply(specBuilder).build());
    }
}
