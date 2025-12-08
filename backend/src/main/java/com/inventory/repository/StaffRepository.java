package com.inventory.repository;

import com.inventory.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Staff> findByDesignation(Staff.Designation designation);
    List<Staff> findByStatus(Staff.Status status);
    List<Staff> findByDepartment(String department);
}
