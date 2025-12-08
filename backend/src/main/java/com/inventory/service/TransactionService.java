package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.entity.Customer;
import com.inventory.entity.InventoryStock;
import com.inventory.entity.Transaction;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CustomerRepository;
import com.inventory.repository.InventoryStockRepository;
import com.inventory.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final InventoryStockRepository inventoryRepository;

    @Transactional
    public TransactionDTO createTransaction(CreateTransactionRequest request) {
        if (request.getCustomerId() == null) {
            throw new BadRequestException("Customer ID must not be null");
        }
        Long customerId = request.getCustomerId();
        if (customerId == null) {
            throw new BadRequestException("Customer ID must not be null");
        }
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));

        if (request.getItemId() == null) {
            throw new BadRequestException("Item ID must not be null");
        }
        Long itemId = request.getItemId();
        if (itemId == null) {
            throw new BadRequestException("Item ID must not be null");
        }
        InventoryStock item = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        if (item.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + item.getQuantity());
        }

        BigDecimal totalPrice = item.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        Transaction transaction = Transaction.builder()
                .customer(customer)
                .item(item)
                .quantity(request.getQuantity())
                .totalPrice(totalPrice)
                .build();

        item.setQuantity(item.getQuantity() - request.getQuantity());
        inventoryRepository.save(item);

        return TransactionDTO.fromEntity(transactionRepository.save(transaction));
    }

    public TransactionDTO getTransactionById(Long id) {
        if (id == null) {
            throw new BadRequestException("Transaction ID must not be null");
        }
        return transactionRepository.findById(id)
                .map(TransactionDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));
    }

    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAllOrderByDateDesc().stream()
                .map(TransactionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByCustomer(Long customerId) {
        return transactionRepository.findByCustomerId(customerId).stream()
                .map(TransactionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TransactionDTO> getTransactionsByItem(Long itemId) {
        return transactionRepository.findByItemId(itemId).stream()
                .map(TransactionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BigDecimal getTotalRevenue() {
        return transactionRepository.findAll().stream()
                .map(Transaction::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
