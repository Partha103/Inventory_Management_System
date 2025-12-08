package com.inventory.dto;

import com.inventory.entity.Transaction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long itemId;
    private String itemName;
    private Integer quantity;
    private BigDecimal totalPrice;
    private LocalDateTime createdDate;

    public static TransactionDTO fromEntity(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .customerId(transaction.getCustomer().getId())
                .customerName(transaction.getCustomer().getName())
                .itemId(transaction.getItem().getId())
                .itemName(transaction.getItem().getItemName())
                .quantity(transaction.getQuantity())
                .totalPrice(transaction.getTotalPrice())
                .createdDate(transaction.getCreatedDate())
                .build();
    }
}
