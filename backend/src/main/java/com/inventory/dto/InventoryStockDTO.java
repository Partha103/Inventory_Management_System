package com.inventory.dto;

import com.inventory.entity.InventoryStock;
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
public class InventoryStockDTO {
    private Long id;
    private String itemName;
    private Integer quantity;
    private String category;
    private BigDecimal price;
    private String description;
    private LocalDateTime updatedDate;

    public static InventoryStockDTO fromEntity(InventoryStock stock) {
        return InventoryStockDTO.builder()
                .id(stock.getId())
                .itemName(stock.getItemName())
                .quantity(stock.getQuantity())
                .category(stock.getCategory())
                .price(stock.getPrice())
                .description(stock.getDescription())
                .updatedDate(stock.getUpdatedDate())
                .build();
    }
}
