package com.inventory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStaffRequest {
    private String name;
    private String email;
    private String password;
    private String designation;
    private String department;
    private String phoneNumber;
    private String privileges;
    private String status;
}
