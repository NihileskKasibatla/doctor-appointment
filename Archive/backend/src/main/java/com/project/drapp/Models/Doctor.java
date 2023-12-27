package com.project.drapp.Models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "doctor")
public class Doctor {
    @Id
    public String email;
    public String name;
    public String department;
    public String center;
    public String availableStartTime;
    public String availableEndTime;
    public String password;
    public int rating;
}

