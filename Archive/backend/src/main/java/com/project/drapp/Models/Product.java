package com.project.drapp.Models;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product {
    @Id
    public String id;
    public String price;
    public String name;
    public String pdesc;
    public String img;
    public String quantity;
    public String seller; // ID of hotel offering this item
}
