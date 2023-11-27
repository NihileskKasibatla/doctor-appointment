package com.project.drapp.Models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "returns")
@AllArgsConstructor
@NoArgsConstructor
public class OrderReturnRequest {
    public String orderId;
    public String sellerId;
    @Id
    public String id;
    public String returnReason;
}
