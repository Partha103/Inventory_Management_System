package com.inventory.dto;

import com.inventory.entity.Staff;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffDTO {
    private Long id;
    private String name;
    private String email;
    private String designation;
    private String department;
    private String phoneNumber;
    private String privileges;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    public static StaffDTO fromEntity(Staff staff) {
        return StaffDTO.builder()
                .id(staff.getId())
                .name(staff.getName())
                .email(staff.getEmail())
                .designation(staff.getDesignation().name())
                .department(staff.getDepartment())
                .phoneNumber(staff.getPhoneNumber())
                .privileges(staff.getPrivileges())
                .status(staff.getStatus().name())
                .createdDate(staff.getCreatedDate())
                .updatedDate(staff.getUpdatedDate())
                .build();
    }
}
