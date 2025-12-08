package com.inventory.service;

import com.inventory.dto.DashboardStats;
import com.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StaffRepository staffRepository;
    private final CustomerRepository customerRepository;
    private final InventoryStockRepository inventoryRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public DashboardStats getStats() {
        return DashboardStats.builder()
                .totalStaff(staffRepository.count())
                .totalCustomers(customerRepository.count())
                .totalInventoryItems(inventoryRepository.count())
                .totalTransactions(transactionRepository.count())
                .lowStockItems(inventoryRepository.findByQuantityLessThan(10).size())
                .totalRevenue(transactionService.getTotalRevenue())
                .build();
    }
}
