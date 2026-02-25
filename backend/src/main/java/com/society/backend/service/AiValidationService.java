package com.society.backend.service;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AiValidationService {

    // The URL where your Python Flask app is running
    private static final String AI_SERVICE_URL = "http://localhost:5000/verify-video";

    public Map<String, Object> verifyComplaintMedia(String mediaUrl, String category, String description) {
        RestTemplate restTemplate = new RestTemplate();
        
        // Prepare the JSON payload for Python
        Map<String, String> requestPayload = new HashMap<>();
        // Note: Even if we call the Java variable 'imageUrl', we send it as 'video_url' to match Python
        requestPayload.put("video_url", mediaUrl); 
        requestPayload.put("category", category);
        requestPayload.put("description", description);

        try {
            // Send POST request to Python AI
            ResponseEntity<Map> response = restTemplate.postForEntity(AI_SERVICE_URL, requestPayload, Map.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("Failed to connect to AI Service: " + e.getMessage());
            return null; // Return null if AI is down, so we don't crash the whole app
        }
    }

    public boolean validateComplaint(String imageUrl) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'validateComplaint'");
    }
}