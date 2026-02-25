package com.society.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    private final S3Client s3Client;

    @Value("${supabase.storage.bucket}")
    private String bucketName;

    @Value("${supabase.storage.public-url}")
    private String publicUrlPrefix;

    public StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        
        // Extract the file extension (e.g., .mp4, .jpg)
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        // Generate a random unique file name: e.g., "a1b2c3d4-e5f6.mp4"
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        // Prepare the upload request to Supabase
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(uniqueFileName)
                .contentType(file.getContentType()) // e.g., video/mp4
                .build();

        // Upload the file
        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        // Return the final public URL
        return publicUrlPrefix + uniqueFileName;
    }
}