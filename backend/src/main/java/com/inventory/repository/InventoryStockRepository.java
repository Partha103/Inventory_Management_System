package com.inventory.repository;

import com.inventory.entity.InventoryStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InventoryStockRepository extends JpaRepository<InventoryStock, Long> {
    List<InventoryStock> findByCategory(String category);

    List<InventoryStock> findByItemNameContainingIgnoreCase(String itemName);

    @Query("SELECT DISTINCT i.category FROM InventoryStock i WHERE i.category IS NOT NULL")
    List<String> findAllCategories();

    List<InventoryStock> findByQuantityLessThan(Integer quantity);

    @Query("SELECT i FROM InventoryStock i WHERE i.quantity > 0")
    List<InventoryStock> findAvailableItems();
}
