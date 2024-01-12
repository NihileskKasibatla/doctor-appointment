package com.project.drapp.Models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "appointments")
@AllArgsConstructor
@NoArgsConstructor
public class Appointment {
    @Id
    public String id;
    public String userEmail;
    public String doctorPhone;
    public String doctorName;
    public String doctorEmail;
    public String slot;
    public String reason;
    public String medicalCenter;
    public String feedback;
    public String message;
}
