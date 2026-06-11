package com.electricalstore.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI electricalStoreOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Electrical Accessories Store API")
                        .description("REST API for catalog browsing and environment-based product selection")
                        .version("1.0.0"));
    }
}
