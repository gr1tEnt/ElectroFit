package com.electricalstore.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Files;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

class ProductImageStorageServiceTest {

    @TempDir
    Path tempDir;

    @Test
    void store_savesPngWithUuidFilename() throws Exception {
        ProductImageStorageService service = new ProductImageStorageService(tempDir.toString());
        MockMultipartFile file = new MockMultipartFile(
                "image", "product photo.png", "image/png", new byte[] {(byte) 0x89, 0x50, 0x4E, 0x47});

        String path = service.store(file);

        assertThat(path).startsWith("/images/products/");
        assertThat(path).endsWith(".png");
        Path saved = tempDir.resolve(path.substring("/images/products/".length()));
        assertThat(Files.exists(saved)).isTrue();
    }

    @Test
    void store_rejectsUnsupportedType() {
        ProductImageStorageService service = new ProductImageStorageService(tempDir.toString());
        MockMultipartFile file =
                new MockMultipartFile("image", "doc.pdf", "application/pdf", new byte[] {0x01});

        assertThatThrownBy(() -> service.store(file))
                .isInstanceOf(ResponseStatusException.class)
                .extracting(ex -> ((ResponseStatusException) ex).getStatusCode())
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }
}
