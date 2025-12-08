package com.inventory.config;

import com.inventory.entity.*;
import com.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StaffRepository staffRepository;
    private final CustomerRepository customerRepository;
    private final InventoryStockRepository inventoryRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (staffRepository.count() == 0) {
            Staff admin = Staff.builder()
                    .name("Admin User")
                    .email("admin@inventory.com")
                    .password(passwordEncoder.encode("admin123"))
                    .designation(Staff.Designation.ADMIN)
                    .department("Management")
                    .phoneNumber("+1234567890")
                    .privileges("ALL")
                    .status(Staff.Status.ACTIVE)
                    .build();
            staffRepository.save(admin);

            Staff staff = Staff.builder()
                    .name("Staff User")
                    .email("staff@inventory.com")
                    .password(passwordEncoder.encode("staff123"))
                    .designation(Staff.Designation.STAFF)
                    .department("Warehouse")
                    .phoneNumber("+1234567891")
                    .privileges("INVENTORY,TRANSACTIONS")
                    .status(Staff.Status.ACTIVE)
                    .build();
            staffRepository.save(staff);

            System.out.println("Sample staff created: admin@inventory.com/admin123, staff@inventory.com/staff123");
        }

        if (customerRepository.count() == 0) {
            Customer customer = Customer.builder()
                    .name("John Customer")
                    .email("customer@example.com")
                    .pin(passwordEncoder.encode("1234"))
                    .phoneNumber("+1234567892")
                    .build();
            customerRepository.save(customer);

            System.out.println("Sample customer created: customer@example.com/1234");
        }

        if (inventoryRepository.count() == 0) {
            InventoryStock item1 = InventoryStock.builder()
                    .itemName("Laptop Dell XPS 15")
                    .quantity(25)
                    .category("Electronics")
                    .price(new BigDecimal("1299.99"))
                    .description("High-performance laptop with 15-inch display")
                    .build();
            if (item1 != null) inventoryRepository.save(item1);

            InventoryStock item2 = InventoryStock.builder()
                    .itemName("Wireless Mouse")
                    .quantity(150)
                    .category("Electronics")
                    .price(new BigDecimal("29.99"))
                    .description("Ergonomic wireless mouse with USB receiver")
                    .build();
            if (item2 != null) inventoryRepository.save(item2);

            InventoryStock item3 = InventoryStock.builder()
                    .itemName("Office Chair")
                    .quantity(45)
                    .category("Furniture")
                    .price(new BigDecimal("299.99"))
                    .description("Ergonomic office chair with lumbar support")
                    .build();
            if (item3 != null) inventoryRepository.save(item3);

            InventoryStock item4 = InventoryStock.builder()
                    .itemName("Standing Desk")
                    .quantity(20)
                    .category("Furniture")
                    .price(new BigDecimal("499.99"))
                    .description("Electric height-adjustable standing desk")
                    .build();
            if (item4 != null) inventoryRepository.save(item4);

            InventoryStock item5 = InventoryStock.builder()
                    .itemName("USB-C Hub")
                    .quantity(5)
                    .category("Electronics")
                    .price(new BigDecimal("79.99"))
                    .description("7-in-1 USB-C hub with HDMI and card reader")
                    .build();
            if (item5 != null) inventoryRepository.save(item5);

            System.out.println("Sample inventory items created");
        }
    }
}
