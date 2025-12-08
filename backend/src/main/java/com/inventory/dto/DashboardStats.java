package com.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {
    private long totalStaff;
    private long totalCustomers;
    private long totalInventoryItems;
    private long totalTransactions;
    private long lowStockItems;
    private BigDecimal totalRevenue;
}
