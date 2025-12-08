package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getAllTransactions() {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getAllTransactions()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionDTO>> getTransactionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTransactionById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionDTO>> createTransaction(@Valid @RequestBody CreateTransactionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Transaction created successfully", transactionService.createTransaction(request)));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getTransactionsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTransactionsByCustomer(customerId)));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getTransactionsByItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTransactionsByItem(itemId)));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<BigDecimal>> getTotalRevenue() {
        return ResponseEntity.ok(ApiResponse.success(transactionService.getTotalRevenue()));
    }
}
