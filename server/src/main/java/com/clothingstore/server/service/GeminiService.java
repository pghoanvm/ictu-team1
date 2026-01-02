package com.clothingstore.server.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String callGemini(String userMessage) {
        String finalUrl = apiUrl + apiKey;

        // Tạo cấu trúc JSON gửi đi theo đúng chuẩn Google yêu cầu
        // Body: { "contents": [{ "parts": [{ "text": "Câu hỏi..." }] }] }
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text",
                "Bạn là nhân viên tư vấn bán quần áo. Hãy trả lời ngắn gọn, lịch sự. Khách hỏi: " + userMessage);

        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(parts));

        // Gửi Request
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            // Nhận kết quả và lọc lấy phần text trả lời
            Map<String, Object> response = restTemplate.postForObject(finalUrl, entity, Map.class);
            return extractTextFromResponse(response);
        } catch (Exception e) {
            e.printStackTrace(); // <--- THÊM DÒNG NÀY ĐỂ XEM LỖI GÌ
            return "Xin lỗi, hệ thống AI đang bận. Vui lòng thử lại sau.";
        }
    }

    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            e.printStackTrace();
            return "Lỗi đọc dữ liệu từ AI.";
        }
    }
}