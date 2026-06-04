package com.electricalstore.controller;

import com.electricalstore.dto.ProductResponse;
import com.electricalstore.dto.SmartSelectRequest;
import com.electricalstore.service.ProductResponseMapper;
import com.electricalstore.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Catalog and smart selection endpoints")
public class ProductController {

    private final ProductService productService;
    private final ProductResponseMapper productResponseMapper;

    public ProductController(ProductService productService, ProductResponseMapper productResponseMapper) {
        this.productService = productService;
        this.productResponseMapper = productResponseMapper;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(
            summary = "List products",
            description = "Returns all products, optionally filtered by brand name, series name, or category name.")
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
                    String category) {
        return productResponseMapper.toResponses(productService.findProducts(brand, series, category));
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
