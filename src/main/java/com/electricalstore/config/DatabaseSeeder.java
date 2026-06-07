package com.electricalstore.config;

import com.electricalstore.entity.Brand;
import com.electricalstore.entity.Category;
import com.electricalstore.entity.IpRating;
import com.electricalstore.entity.Product;
import com.electricalstore.entity.ProductType;
import com.electricalstore.entity.TechnicalSpec;
import com.electricalstore.entity.Order;
import com.electricalstore.entity.OrderStatus;
import com.electricalstore.entity.SupportMessage;
import com.electricalstore.repository.BrandRepository;
import com.electricalstore.repository.CategoryRepository;
import com.electricalstore.repository.OrderRepository;
import com.electricalstore.repository.ProductRepository;
import com.electricalstore.repository.SupportMessageRepository;
import com.electricalstore.repository.TechnicalSpecRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@org.springframework.core.annotation.Order(1)
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    /** SKU → filename under frontend/public/images/products/ */
    private static final Map<String, String> PRODUCT_IMAGE_FILES = Map.ofEntries(
            Map.entry("SKT-VL-IP20-2P", "Valena-Life-double-socket-IP20.JPG"),
            Map.entry("SKT-VL-IP20-1P", "Valena-Life-singlesocket-IP20.jpg"),
            Map.entry("SKT-AF-IP20-2P", "Asfora-double-socket-IP20.jpg"),
            Map.entry("FRM-VL-1P", "Valena-Life 1-post frame.jpg"),
            Map.entry("FRM-VL-2P", "Valena-Life-2-post-frame.jpg"),
            Map.entry("FRM-VL-3P", "Valena-Life-3-post-frame.jpg"),
            Map.entry("FRM-VL-4P", "Valena-Life-4-post-frame.jpg"),
            Map.entry("FRM-VL-5P", "Valena-Life-5-post-frame.jpg"),
            Map.entry("FRM-AF-1P", "Asfora-1-post-frame.jpg"),
            Map.entry("FRM-AF-2P", "Asfora-2-post-frame.jpg"),
            Map.entry("FRM-AF-3P", "Asfora-3-post-frame.jpg"),
            Map.entry("SKT-VL-IP44-SPL", "Valena-Life-socket-IP44-with-splash-cover.jpg"),
            Map.entry("SKT-AF-IP44-SPL", "Asfora-socket-IP44-with-splash-cover.jpg"),
            Map.entry("SKT-VL-SELV-12V", "Valena-Life-12V-SELV-shaver-socket.jpg"),
            Map.entry("SKT-VL-KIDS", "Valena-Life-socket-with-child-protection.jpg"),
            Map.entry("SKT-AF-KIDS", "Asfora-socket with-child-protection.jpg"),
            Map.entry("SW-VL-IP65", "Valena-Life-weatherproof-switch-IP65.jpg"),
            Map.entry("SW-AF-IP55", "Asfora-weatherproof-switch-IP55.jpg"),
            Map.entry("SKT-AF-IP54-OUT", "Asfora-outdoor-socket-IP54.jpg"),
            Map.entry("SKT-VL-IP44-KIT", "Valena-Life-kitchen-socket-IP44.jpg"));

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final TechnicalSpecRepository technicalSpecRepository;
    private final SupportMessageRepository supportMessageRepository;
    private final OrderRepository orderRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public DatabaseSeeder(
            BrandRepository brandRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            TechnicalSpecRepository technicalSpecRepository,
            SupportMessageRepository supportMessageRepository,
            OrderRepository orderRepository) {
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.technicalSpecRepository = technicalSpecRepository;
        this.supportMessageRepository = supportMessageRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Clearing catalog data and re-seeding…");
        clearCatalogData();

        log.info("Seeding electrical store catalog…");

        Brand legrandValena = saveBrand("Legrand", "Valena Life");
        Brand schneiderAsfora = saveBrand("Schneider Electric", "Asfora");

        Category sockets = saveCategory("Sockets");
        Category frames = saveCategory("Frames");
        Category switches = saveCategory("Switches");

        seedBedroomProducts(legrandValena, schneiderAsfora, sockets, frames, switches);
        seedBathroomProducts(legrandValena, schneiderAsfora, sockets);
        seedKidsRoomProducts(legrandValena, schneiderAsfora, sockets);
        seedOutdoorProducts(legrandValena, schneiderAsfora, sockets, switches);
        seedKitchenProducts(legrandValena, sockets);

        seedSupportMessages();
        seedMockOrders();

        log.info("Seeded {} products.", productRepository.count());
    }

    private void seedMockOrders() {
        if (orderRepository.count() > 0) {
            log.info("Skipping mock order seed — {} existing order(s) preserved.", orderRepository.count());
            return;
        }

        LocalDate today = LocalDate.now();
        YearMonth current = YearMonth.from(today);

        List<Order> orders = List.of(
                mockOrder("Olena Kovalenko", "olena.k@example.com", "124.50", OrderStatus.COMPLETED, monthAt(current, -4, 5)),
                mockOrder("Martin Novak", "martin.n@example.com", "89.90", OrderStatus.SHIPPED, monthAt(current, -4, 18)),
                mockOrder("Sarah Mitchell", "sarah.m@example.com", "210.00", OrderStatus.COMPLETED, monthAt(current, -3, 3)),
                mockOrder("Jan Dvořák", "jan.d@example.com", "45.80", OrderStatus.PENDING, monthAt(current, -3, 22)),
                mockOrder("Emma Wilson", "emma.w@example.com", "156.40", OrderStatus.COMPLETED, monthAt(current, -2, 8)),
                mockOrder("Lucas Bernard", "lucas.b@example.com", "312.75", OrderStatus.COMPLETED, monthAt(current, -2, 14)),
                mockOrder("Anna Petrova", "anna.p@example.com", "67.20", OrderStatus.SHIPPED, monthAt(current, -2, 27)),
                mockOrder("Tomáš Horák", "tomas.h@example.com", "98.00", OrderStatus.COMPLETED, monthAt(current, -1, 6)),
                mockOrder("Julia Schmidt", "julia.s@example.com", "178.30", OrderStatus.PENDING, monthAt(current, -1, 19)),
                mockOrder("Peter Walsh", "peter.w@example.com", "245.60", OrderStatus.COMPLETED, monthAt(current, 0, 2)),
                mockOrder("Maria Costa", "maria.c@example.com", "54.90", OrderStatus.COMPLETED, monthAt(current, 0, 9)),
                mockOrder("David Chen", "david.c@example.com", "132.15", OrderStatus.SHIPPED, monthAt(current, 0, 15)));

        orderRepository.saveAll(orders);
        log.info("Seeded {} mock orders.", orderRepository.count());
    }

    private static Order mockOrder(
            String customerName,
            String customerEmail,
            String totalAmount,
            OrderStatus status,
            LocalDateTime createdAt) {
        return Order.builder()
                .customerName(customerName)
                .customerEmail(customerEmail)
                .totalAmount(new BigDecimal(totalAmount))
                .status(status)
                .createdAt(createdAt)
                .build();
    }

    private static LocalDateTime monthAt(YearMonth anchor, int monthOffset, int dayOfMonth) {
        YearMonth target = anchor.plusMonths(monthOffset);
        int day = Math.min(dayOfMonth, target.lengthOfMonth());
        return target.atDay(day).atTime(10, 30);
    }

    private void seedSupportMessages() {
        supportMessageRepository.saveAll(List.of(
                SupportMessage.builder()
                        .fullName("Olena Kovalenko")
                        .email("olena.k@example.com")
                        .inquiryType("Technical Safety Advice")
                        .message(
                                "Can I use IP20 sockets in a bathroom zone 3 if they are more than 60 cm from the shower?")
                        .createdAt(LocalDateTime.now().minusDays(2))
                        .build(),
                SupportMessage.builder()
                        .fullName("Martin Novak")
                        .email("martin.n@example.com")
                        .inquiryType("Product Compatibility Issue")
                        .message(
                                "I need a 3-post Valena Life frame with two IP44 sockets and one switch — will the configurator support this?")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build(),
                SupportMessage.builder()
                        .fullName("Sarah Mitchell")
                        .email("sarah.m@example.com")
                        .inquiryType("Order Support")
                        .message("Please confirm delivery time for order placed yesterday with 5× Legrand mechanisms.")
                        .createdAt(LocalDateTime.now().minusHours(5))
                        .build()));
        log.info("Seeded {} support messages.", supportMessageRepository.count());
    }

    private void seedBedroomProducts(
            Brand legrand, Brand schneider, Category sockets, Category frames, Category switches) {
        saveMechanism(
                "SKT-VL-IP20-2P",
                "Valena Life double socket IP20",
                "Standard 2P+E socket for dry rooms (bedroom, living room).",
                "18.90",
                legrand,
                sockets,
                false,
                IpRating.IP20,
                16,
                spec -> spec.ipRating(IpRating.IP20)
                        .maxAmps(16)
                        .hasChildProtection(false)
                        .hasGrounding(true),
                List.of("BEDROOM", "LIVING_ROOM"));

        saveMechanism(
                "SKT-VL-IP20-1P",
                "Valena Life single socket IP20",
                "Single outlet for bedside or desk circuits.",
                "12.50",
                legrand,
                sockets,
                false,
                IpRating.IP20,
                16,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(16).hasChildProtection(false).hasGrounding(true),
                List.of("BEDROOM", "LIVING_ROOM"));

        saveMechanism(
                "SW-VL-IP20",
                "Valena Life single-pole switch IP20",
                "Modular light switch for dry rooms — same series as Valena Life frames.",
                "11.90",
                legrand,
                switches,
                false,
                IpRating.IP20,
                10,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(10).hasChildProtection(false).hasGrounding(true),
                List.of("BEDROOM", "LIVING_ROOM"));

        saveMechanism(
                "USB-VL-2A",
                "Valena Life USB-A+C charging module",
                "Dual USB charger module (5V/2A) for bedside or desk blocks.",
                "29.50",
                legrand,
                sockets,
                true,
                IpRating.IP20,
                3,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(3).hasChildProtection(false).hasGrounding(false),
                List.of("BEDROOM", "LIVING_ROOM"));

        saveMechanism(
                "SKT-AF-IP20-2P",
                "Asfora double socket IP20",
                "Schneider Asfora modular socket for dry interior zones.",
                "16.40",
                schneider,
                sockets,
                false,
                IpRating.IP20,
                16,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(16).hasChildProtection(false).hasGrounding(true),
                List.of("BEDROOM", "LIVING_ROOM"));

        for (int posts : new int[] {1, 2, 3, 4, 5}) {
            saveFrame(
                    "FRM-VL-" + posts + "P",
                    "Valena Life " + posts + "-post frame",
                    "IP20 modular frame for " + posts + " mechanism(s).",
                    BigDecimal.valueOf(6.20 * posts),
                    legrand,
                    frames,
                    posts,
                    List.of("BEDROOM", "LIVING_ROOM"));
        }

        for (int posts : new int[] {1, 2, 3}) {
            saveFrame(
                    "FRM-AF-" + posts + "P",
                    "Asfora " + posts + "-post frame",
                    "Asfora series frame, " + posts + " gangs.",
                    BigDecimal.valueOf(5.80 * posts),
                    schneider,
                    frames,
                    posts,
                    List.of("BEDROOM", "LIVING_ROOM"));
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
                IpRating.IP44,
                16,
                spec -> spec.ipRating(IpRating.IP44)
                        .maxAmps(16)
                        .hasChildProtection(false)
                        .hasGrounding(true),
                List.of("BATHROOM", "KITCHEN"));

        saveMechanism(
                "SKT-AF-IP44-SPL",
                "Asfora socket IP44 with splash cover",
                "Asfora IP44 mechanism with integrated splash protection.",
                "22.10",
                schneider,
                sockets,
                false,
                IpRating.IP44,
                16,
                spec -> spec.ipRating(IpRating.IP44).maxAmps(16).hasChildProtection(false).hasGrounding(true),
                List.of("BATHROOM", "KITCHEN"));

        saveMechanism(
                "SKT-VL-SELV-12V",
                "Valena Life 12V SELV shaver socket",
                "Low-voltage outlet for bathroom zones 1–2 within 60 cm of water.",
                "31.00",
                legrand,
                sockets,
                true,
                IpRating.IP44,
                3,
                spec -> spec.ipRating(IpRating.IP44).maxAmps(3).hasChildProtection(false).hasGrounding(false),
                List.of("BATHROOM"));
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
                IpRating.IP20,
                16,
                spec -> spec.ipRating(IpRating.IP20)
                        .maxAmps(16)
                        .hasChildProtection(true)
                        .hasGrounding(true),
                List.of("KIDS_ROOM", "BEDROOM"));

        saveMechanism(
                "SKT-AF-KIDS",
                "Asfora socket with child protection",
                "Asfora mechanism with integrated child safety shutters.",
                "19.70",
                schneider,
                sockets,
                false,
                IpRating.IP20,
                16,
                spec -> spec.ipRating(IpRating.IP20).maxAmps(16).hasChildProtection(true).hasGrounding(true),
                List.of("KIDS_ROOM", "BEDROOM"));
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
                IpRating.IP65,
                20,
                spec -> spec.ipRating(IpRating.IP65).maxAmps(20).hasChildProtection(false).hasGrounding(true),
                List.of("OUTDOOR", "GARAGE"));

        saveMechanism(
                "SW-AF-IP55",
                "Asfora weatherproof switch IP55",
                "Outdoor-rated switch for garages and covered patios.",
                "26.20",
                schneider,
                switches,
                false,
                IpRating.IP55,
                20,
                spec -> spec.ipRating(IpRating.IP55).maxAmps(20).hasChildProtection(false).hasGrounding(true),
                List.of("OUTDOOR", "GARAGE"));

        saveMechanism(
                "SKT-AF-IP54-OUT",
                "Asfora outdoor socket IP54",
                "Surface-mounted weather-resistant socket.",
                "34.80",
                schneider,
                sockets,
                false,
                IpRating.IP54,
                16,
                spec -> spec.ipRating(IpRating.IP54).maxAmps(16).hasChildProtection(false).hasGrounding(true),
                List.of("OUTDOOR", "GARAGE"));
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
                IpRating.IP44,
                16,
                spec -> spec.ipRating(IpRating.IP44).maxAmps(16).hasChildProtection(false).hasGrounding(true),
                List.of("KITCHEN"));
    }

    private void clearCatalogData() {
        entityManager
                .createNativeQuery(
                        """
                        TRUNCATE TABLE
                          support_messages,
                          technical_spec_room_compatibility,
                          technical_specs,
                          product_image_urls,
                          product_attributes,
                          products,
                          brands,
                          categories
                        RESTART IDENTITY CASCADE
                        """)
                .executeUpdate();
        entityManager.flush();
        entityManager.clear();
    }

    private Brand saveBrand(String name, String series) {
        return brandRepository.save(Brand.builder().name(name).seriesName(series).build());
    }

    private Category saveCategory(String name) {
        return categoryRepository.save(Category.builder().name(name).build());
    }

    private List<String> resolveProductImageUrls(String sku, String name) {
        if (name != null) {
            String lowerName = name.toLowerCase(Locale.ROOT);
            if (lowerName.contains("usb")) {
                return List.of("/images/products/usb.jpg");
            }
            if (lowerName.contains("switch")) {
                return List.of("/images/products/switch.jpg");
            }
        }

        String fileName = PRODUCT_IMAGE_FILES.get(sku);
        if (fileName != null) {
            return List.of("/images/products/" + fileName);
        }
        return List.of();
    }

    private static String primaryImageUrl(List<String> imageUrls) {
        return imageUrls.isEmpty() ? null : imageUrls.get(0);
    }

    private Map<String, String> buildDetailedAttributes(
            Brand brand,
            String sku,
            ProductType type,
            IpRating ipRating,
            int maxAmps,
            Integer framePosts,
            boolean lowVoltage) {
        Map<String, String> attributes = new LinkedHashMap<>();
        attributes.put("Series", brand != null ? brand.getSeriesName() : "—");
        attributes.put("Mounting", "Zapuštěná (Вбудований)");
        attributes.put("Rated Current", maxAmps + " A");
        attributes.put("Voltage", resolveVoltage(maxAmps, lowVoltage));
        attributes.put("Material", "ABS + PC");
        attributes.put("Dimensions", resolveDimensions(sku, type, framePosts));
        attributes.put("IP Rating", ipRating.name());
        attributes.put("Standards", resolveStandards(sku, type));
        attributes.put("Operating temperature", "-5 °C … +40 °C");
        if (type == ProductType.FRAME && framePosts != null) {
            attributes.put("Module capacity", framePosts + "-gang");
        }
        return attributes;
    }

    private static String resolveVoltage(int maxAmps, boolean lowVoltage) {
        if (lowVoltage) {
            return "12 V SELV";
        }
        return maxAmps >= 20 ? "400 V AC" : "250 V AC";
    }

    private static String resolveStandards(String sku, ProductType type) {
        if (sku != null && sku.startsWith("SW-")) {
            return "IEC 60669-1";
        }
        return type == ProductType.FRAME ? "IEC 60669-1" : "IEC 60884-1";
    }

    private static String resolveDimensions(String sku, ProductType type, Integer framePosts) {
        if (type == ProductType.FRAME && framePosts != null) {
            int moduleWidth = 71 + (framePosts - 1) * 71;
            return moduleWidth + " x 83 x 48 mm";
        }
        if (sku != null && sku.endsWith("-2P")) {
            return "142 x 83 x 48 mm";
        }
        if (sku != null && sku.startsWith("SW-")) {
            return "83 x 83 x 48 mm";
        }
        if (sku != null && sku.contains("IP54-OUT")) {
            return "95 x 95 x 65 mm";
        }
        return "83 x 83 x 48 mm";
    }

    private void saveFrame(
            String sku,
            String name,
            String description,
            BigDecimal price,
            Brand brand,
            Category category,
            int posts,
            List<String> compatibleRooms) {
        List<String> imageUrls = resolveProductImageUrls(sku, name);
        Map<String, String> detailedAttributes =
                buildDetailedAttributes(brand, sku, ProductType.FRAME, IpRating.IP20, 16, posts, false);
        Product frame = productRepository.save(Product.builder()
                .sku(sku)
                .name(name)
                .description(description)
                .price(price)
                .imageUrl(primaryImageUrl(imageUrls))
                .imageUrls(new ArrayList<>(imageUrls))
                .detailedAttributes(new LinkedHashMap<>(detailedAttributes))
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
                .compatibleRoomTypes(compatibleRooms)
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
            IpRating ipRating,
            int maxAmps,
            java.util.function.Function<TechnicalSpec.TechnicalSpecBuilder, TechnicalSpec.TechnicalSpecBuilder> specCustomizer,
            List<String> compatibleRooms) {
        saveMechanism(
                sku,
                name,
                description,
                price,
                brand,
                category,
                lowVoltage,
                ipRating,
                maxAmps,
                specCustomizer,
                compatibleRooms,
                null);
    }

    private void saveMechanism(
            String sku,
            String name,
            String description,
            String price,
            Brand brand,
            Category category,
            boolean lowVoltage,
            IpRating ipRating,
            int maxAmps,
            java.util.function.Function<TechnicalSpec.TechnicalSpecBuilder, TechnicalSpec.TechnicalSpecBuilder> specCustomizer,
            List<String> compatibleRooms,
            List<String> imageUrlsOverride) {
        List<String> imageUrls = imageUrlsOverride != null
                ? new ArrayList<>(imageUrlsOverride)
                : resolveProductImageUrls(sku, name);
        Map<String, String> detailedAttributes =
                buildDetailedAttributes(brand, sku, ProductType.MECHANISM, ipRating, maxAmps, null, lowVoltage);
        Product product = productRepository.save(Product.builder()
                .sku(sku)
                .name(name)
                .description(description)
                .price(new BigDecimal(price))
                .imageUrl(primaryImageUrl(imageUrls))
                .imageUrls(new ArrayList<>(imageUrls))
                .detailedAttributes(new LinkedHashMap<>(detailedAttributes))
                .type(ProductType.MECHANISM)
                .brand(brand)
                .category(category)
                .lowVoltage(lowVoltage)
                .build());

        TechnicalSpec.TechnicalSpecBuilder specBuilder = TechnicalSpec.builder().product(product);
        technicalSpecRepository.save(
                specCustomizer.apply(specBuilder).compatibleRoomTypes(compatibleRooms).build());
    }
}
