package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.service.InventoryStockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InventoryController {

    private final InventoryStockService inventoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryStockDTO>>> getAllItems() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllItems()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryStockDTO>> getItemById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryStockDTO>> createItem(@Valid @RequestBody CreateInventoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item created successfully", inventoryService.createItem(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryStockDTO>> updateItem(@PathVariable Long id, @Valid @RequestBody CreateInventoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", inventoryService.updateItem(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable Long id) {
        inventoryService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<InventoryStockDTO>>> searchItems(@RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.searchItems(query)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<InventoryStockDTO>>> getItemsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getItemsByCategory(category)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAllCategories()));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryStockDTO>>> getLowStockItems(@RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getLowStockItems(threshold)));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<InventoryStockDTO>>> getAvailableItems() {
        return ResponseEntity.ok(ApiResponse.success(inventoryService.getAvailableItems()));
    }
}
