package com.electricalstore.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${app.product-images.upload-dir:src/main/resources/static/images/products}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path directory = Paths.get(uploadDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/images/products/**")
                .addResourceLocations(
                        "classpath:/static/images/products/",
                        "file:" + directory + "/");
    }
}
