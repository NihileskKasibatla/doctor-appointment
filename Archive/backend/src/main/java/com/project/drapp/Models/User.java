package com.project.drapp.Models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    public String userEmail;
    public String userName;
    public String userPassword;
    public String userAddress;
    public String userPhoneNumber;
}