package com.electricalstore.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductImageStorageService {

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/jpg", "image/png", "image/pjpeg", "image/x-png");
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png");

    private final Path uploadDirectory;

    public ProductImageStorageService(
            @Value("${app.product-images.upload-dir:src/main/resources/static/images/products}")
                    String uploadDir) {
        this.uploadDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only PNG and JPG images are allowed");
        }

        String extension = resolveExtension(file);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Only PNG and JPG images are allowed");
        }

        try {
            Files.createDirectories(uploadDirectory);
            String filename = UUID.randomUUID() + "." + extension;
            Path target = uploadDirectory.resolve(filename).normalize();
            if (!target.startsWith(uploadDirectory)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid image filename");
            }
            file.transferTo(target);
            return "/images/products/" + filename;
        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save product image", ex);
        }
    }

    private static String resolveExtension(MultipartFile file) {
        String original = StringUtils.cleanPath(
                StringUtils.hasText(file.getOriginalFilename()) ? file.getOriginalFilename() : "upload.jpg");
        String extension = StringUtils.getFilenameExtension(original);
        if (StringUtils.hasText(extension)) {
            return extension.toLowerCase(Locale.ROOT);
        }
        String contentType = file.getContentType();
        if (contentType != null && contentType.contains("png")) {
            return "png";
        }
        return "jpg";
    }
}
