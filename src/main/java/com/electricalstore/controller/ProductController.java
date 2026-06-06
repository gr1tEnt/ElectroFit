package com.electricalstore.controller;

import com.electricalstore.dto.ConfiguratorSetResponse;
import com.electricalstore.dto.CreateProductRequest;
import com.electricalstore.dto.UpdateProductRequest;
import com.electricalstore.dto.ProductResponse;
import com.electricalstore.dto.SmartSelectRequest;
import com.electricalstore.service.ConfiguratorService;
import com.electricalstore.service.ProductResponseMapper;
import com.electricalstore.service.ProductService;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Catalog and smart selection endpoints")
public class ProductController {

    private final ProductService productService;
    private final ProductResponseMapper productResponseMapper;
    private final ConfiguratorService configuratorService;

    public ProductController(
            ProductService productService,
            ProductResponseMapper productResponseMapper,
            ConfiguratorService configuratorService) {
        this.productService = productService;
        this.productResponseMapper = productResponseMapper;
        this.configuratorService = configuratorService;
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Get product by id",
            description = "Returns full product details including image gallery and technical specifications.")
    @ApiResponse(responseCode = "200", description = "Product found")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ProductResponse getProduct(
            @Parameter(description = "Product id", example = "1") @PathVariable Long id) {
        return productResponseMapper.toResponse(productService.findProductById(id));
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "List products",
            description = "Returns all products, optionally filtered by brand name, series name, category name, or search text.")
    @ApiResponse(
            responseCode = "200",
            description = "Products matching the filters",
            content = @Content(schema = @Schema(implementation = ProductResponse.class)))
    public List<ProductResponse> listProducts(
            @Parameter(description = "Brand name", example = "Legrand")
                    @RequestParam(required = false)
                    String brand,
            @Parameter(description = "Brand series name", example = "Valena Life")
                    @RequestParam(required = false)
                    String series,
            @Parameter(description = "Category name", example = "Sockets")
                    @RequestParam(required = false)
                    String category,
            @Parameter(description = "Search by product name or brand name", example = "Valena")
                    @RequestParam(required = false)
                    String search) {
        return productResponseMapper.toResponses(
                productService.findProducts(brand, series, category, search));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
            summary = "Create product",
            description =
                    "Creates a product with optional image upload. Send multipart/form-data with a JSON"
                            + " `product` part and an optional `image` file part.")
    public ProductResponse createProduct(
            @RequestPart("product") @Valid CreateProductRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return productResponseMapper
                .toResponses(List.of(productService.createProduct(request, imageFile)))
                .get(0);
    }

    @PutMapping(path = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Update product",
            description = "Updates product data, technical spec, and detailed attributes.")
    @ApiResponse(responseCode = "200", description = "Product updated")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public ProductResponse updateProduct(
            @PathVariable Long id, @Valid @RequestBody UpdateProductRequest request) {
        return productResponseMapper.toResponse(productService.updateProduct(id, request));
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete product", description = "Removes a product and its technical specification.")
    @ApiResponse(responseCode = "204", description = "Product deleted")
    @ApiResponse(responseCode = "404", description = "Product not found")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PostMapping(
            path = "/smart-select",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Smart product selection",
            description =
                    "Recommends products based on room type, proximity to water, and whether children are present.")
    @ApiResponse(responseCode = "200", description = "Recommended products")
    @ApiResponse(responseCode = "400", description = "Invalid room type or request body")
    public List<ProductResponse> smartSelect(@Valid @RequestBody SmartSelectRequest request) {
        return productResponseMapper.toResponses(productService.recommendProducts(
                request.roomType(), request.nearWater(), request.hasChildren()));
    }

    @GetMapping(path = "/configurator", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Modular set configurator",
            description =
                    "Returns frame and matching mechanism products for the same brand and series (e.g. 3-post frame + 3 sockets).")
    @ApiResponse(responseCode = "200", description = "Compatible modular sets")
    public List<ConfiguratorSetResponse> configurator(
            @Parameter(description = "Number of posts / mechanisms", example = "3") @RequestParam int postsCount,
            @Parameter(description = "Mechanism category name", example = "Sockets") @RequestParam(defaultValue = "Sockets")
                    String category) {
        return configuratorService.findCompatibleSets(postsCount, category);
    }

    @GetMapping(path = "/frames/compatible/{seriesName}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "Compatible frames by series",
            description = "Returns frame products that belong to the given brand series.")
    @ApiResponse(responseCode = "200", description = "Matching frame products")
    public List<ProductResponse> compatibleFrames(
            @Parameter(description = "Brand series name", example = "Valena Life")
                    @PathVariable
                    String seriesName) {
        return productResponseMapper.toResponses(productService.findCompatibleFrames(seriesName));
    }
}
