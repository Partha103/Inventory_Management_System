package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StaffDTO>>> getAllStaff() {
        return ResponseEntity.ok(ApiResponse.success(staffService.getAllStaff()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffDTO>> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(staffService.getStaffById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StaffDTO>> createStaff(@Valid @RequestBody CreateStaffRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Staff created successfully", staffService.createStaff(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<StaffDTO>> updateStaff(@PathVariable Long id, @RequestBody UpdateStaffRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Staff updated successfully", staffService.updateStaff(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success("Staff deleted successfully", null));
    }
}
