package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.entity.Staff;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), staff.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (staff.getStatus() != Staff.Status.ACTIVE) {
            throw new BadRequestException("Account is inactive");
        }

        String token = generateToken(staff);

        return LoginResponse.builder()
                .id(staff.getId())
                .name(staff.getName())
                .email(staff.getEmail())
                .designation(staff.getDesignation().name())
                .token(token)
                .privileges(staff.getPrivileges())
                .userType("STAFF")
                .build();
    }

    public StaffDTO createStaff(CreateStaffRequest request) {
        if (staffRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Staff staff = Staff.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .designation(Staff.Designation.valueOf(request.getDesignation().toUpperCase()))
                .department(request.getDepartment())
                .phoneNumber(request.getPhoneNumber())
                .privileges(request.getPrivileges())
                .status(Staff.Status.ACTIVE)
                .build();

        return StaffDTO.fromEntity(staffRepository.save(staff));
    }

    public StaffDTO updateStaff( Long id, UpdateStaffRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));

        if (request.getName() != null) staff.setName(request.getName());
        if (request.getEmail() != null) {
            if (!staff.getEmail().equals(request.getEmail()) && staffRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            staff.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getDesignation() != null) {
            staff.setDesignation(Staff.Designation.valueOf(request.getDesignation().toUpperCase()));
        }
        if (request.getDepartment() != null) staff.setDepartment(request.getDepartment());
        if (request.getPhoneNumber() != null) staff.setPhoneNumber(request.getPhoneNumber());
        if (request.getPrivileges() != null) staff.setPrivileges(request.getPrivileges());
        if (request.getStatus() != null) {
            staff.setStatus(Staff.Status.valueOf(request.getStatus().toUpperCase()));
        }

        return StaffDTO.fromEntity(staffRepository.save(staff));
    }

    public void deleteStaff(Long id) {
        if (id == null) {
            throw new BadRequestException("Staff id must not be null");
        }
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff not found with id: " + id);
        }
        staffRepository.deleteById(id);
    }

    public StaffDTO getStaffById(Long id) {
        if (id == null) {
            throw new BadRequestException("Staff id must not be null");
        }
        return staffRepository.findById(id)
                .map(StaffDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found with id: " + id));
    }

    public List<StaffDTO> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(StaffDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private String generateToken(Staff staff) {
        return java.util.Base64.getEncoder().encodeToString(
                (staff.getId() + ":" + staff.getEmail() + ":" + System.currentTimeMillis()).getBytes()
        );
    }
}
