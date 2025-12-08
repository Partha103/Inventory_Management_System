package com.inventory.controller;

import com.inventory.dto.*;
import com.inventory.service.CustomerService;
import com.inventory.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final StaffService staffService;
    private final CustomerService customerService;

    @PostMapping("/staff/login")
    public ResponseEntity<ApiResponse<LoginResponse>> staffLogin(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = staffService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/customer/login")
    public ResponseEntity<ApiResponse<LoginResponse>> customerLogin(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = customerService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/customer/register")
    public ResponseEntity<ApiResponse<CustomerDTO>> registerCustomer(@Valid @RequestBody CreateCustomerRequest request) {
        CustomerDTO customer = customerService.createCustomer(request);
        return ResponseEntity.ok(ApiResponse.success("Registration successful", customer));
    }
}
