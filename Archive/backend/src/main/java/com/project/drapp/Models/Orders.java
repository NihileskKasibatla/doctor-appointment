package com.project.drapp.Models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
public class Orders {
    @Id
    public String id;
    public String cvv;
    public String items;
    public String sellerId;
    public String userId;
    public String status;
    public String userName;
    public String price;
}
