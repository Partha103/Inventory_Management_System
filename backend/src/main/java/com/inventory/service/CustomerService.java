package com.inventory.service;

import com.inventory.dto.*;
import com.inventory.entity.Customer;
import com.inventory.exception.BadRequestException;
import com.inventory.exception.ResourceNotFoundException;
import com.inventory.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        Customer customer = customerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or PIN"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPin())) {
            throw new BadRequestException("Invalid email or PIN");
        }

        String token = generateToken(customer);

        return LoginResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .designation("CUSTOMER")
                .token(token)
                .privileges(null)
                .userType("CUSTOMER")
                .build();
    }

    public CustomerDTO createCustomer(CreateCustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .pin(passwordEncoder.encode(request.getPin()))
                .phoneNumber(request.getPhoneNumber())
                .build();

        return CustomerDTO.fromEntity(customerRepository.save(customer));
    }

    public CustomerDTO updateCustomer(Long id, CreateCustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        if (request.getName() != null) customer.setName(request.getName());
        if (request.getEmail() != null) {
            if (!customer.getEmail().equals(request.getEmail()) && customerRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already exists");
            }
            customer.setEmail(request.getEmail());
        }
        if (request.getPin() != null && !request.getPin().isEmpty()) {
            customer.setPin(passwordEncoder.encode(request.getPin()));
        }
        if (request.getPhoneNumber() != null) customer.setPhoneNumber(request.getPhoneNumber());

        return CustomerDTO.fromEntity(customerRepository.save(customer));
    }

    public void deleteCustomer(Long id) {
        if (id == null) {
            throw new BadRequestException("Customer id must not be null");
        }
        if (!customerRepository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found with id: " + id);
        }
        customerRepository.deleteById(id);
    }

    public CustomerDTO getCustomerById(Long id) {
        if (id == null) {
            throw new BadRequestException("Customer id must not be null");
        }
        return customerRepository.findById(id)
                .map(CustomerDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(CustomerDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private String generateToken(Customer customer) {
        return java.util.Base64.getEncoder().encodeToString(
                (customer.getId() + ":" + customer.getEmail() + ":" + System.currentTimeMillis()).getBytes()
        );
    }
}
