package com.clothingstore.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Map;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;

    private String customerName; // Tên khách
    private String phone; // SĐT
    private String address; // Địa chỉ
    private Double totalPrice; // Tổng tiền
    private String status; // Trạng thái (Mới, Đang giao...)

    // Lưu danh sách món hàng (lưu đơn giản dưới dạng List Map)
    private List<Map<String, Object>> items;

    // Constructor
    public Order() {
        this.status = "PENDING"; // Mặc định là Đang chờ xử lý
    }

    // --- GETTER & SETTER (Bắt buộc phải có để Spring đọc dữ liệu) ---
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<Map<String, Object>> getItems() {
        return items;
    }

    public void setItems(List<Map<String, Object>> items) {
        this.items = items;
    }
}