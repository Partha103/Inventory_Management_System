package com.inventory.repository;

import com.inventory.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByCustomerId(Long customerId);
    List<Transaction> findByItemId(Long itemId);
    
    @Query("SELECT t FROM Transaction t WHERE t.createdDate BETWEEN :startDate AND :endDate")
    List<Transaction> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT t FROM Transaction t ORDER BY t.createdDate DESC")
    List<Transaction> findAllOrderByDateDesc();
}
