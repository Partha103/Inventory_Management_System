package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.entity.InventoryStock;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.InventoryStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryStockService {

    private final InventoryStockRepository inventoryRepository;

    public InventoryStockDTO createItem(CreateInventoryRequest request) {
        InventoryStock item = InventoryStock.builder()
                .itemName(request.getItemName())
                .quantity(request.getQuantity())
                .category(request.getCategory())
                .price(request.getPrice())
                .description(request.getDescription())
                .build();

        return InventoryStockDTO.fromEntity(inventoryRepository.save(item));
    }

    public InventoryStockDTO updateItem(@org.springframework.lang.NonNull Long id, CreateInventoryRequest request) {
        InventoryStock item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));

        if (request.getItemName() != null) item.setItemName(request.getItemName());
        if (request.getQuantity() != null) item.setQuantity(request.getQuantity());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getDescription() != null) item.setDescription(request.getDescription());

        return InventoryStockDTO.fromEntity(inventoryRepository.save(item));
    }

    public void deleteItem(Long id) {
        if (id == null || !inventoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Item not found with id: " + id);
        }
        inventoryRepository.deleteById(id);
    }

    public InventoryStockDTO getItemById(Long id) {
        if (id == null) {
            throw new ResourceNotFoundException("Item id cannot be null");
        }
        return inventoryRepository.findById(id)
                .map(InventoryStockDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
    }

    public List<InventoryStockDTO> getAllItems() {
        return inventoryRepository.findAll().stream()
                .map(InventoryStockDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InventoryStockDTO> getItemsByCategory(String category) {
        return inventoryRepository.findByCategory(category).stream()
                .map(InventoryStockDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InventoryStockDTO> searchItems(String query) {
        return inventoryRepository.findByItemNameContainingIgnoreCase(query).stream()
                .map(InventoryStockDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<String> getAllCategories() {
        return inventoryRepository.findAllCategories();
    }

    public List<InventoryStockDTO> getLowStockItems(int threshold) {
        return inventoryRepository.findByQuantityLessThan(threshold).stream()
                .map(InventoryStockDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<InventoryStockDTO> getAvailableItems() {
        return inventoryRepository.findAvailableItems().stream()
                .map(InventoryStockDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public void updateStock(Long id, int quantityChange) {
        if (id == null) {
            throw new ResourceNotFoundException("Item id cannot be null");
        }
        InventoryStock item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        item.setQuantity(item.getQuantity() + quantityChange);
        inventoryRepository.save(item);
    }
}
