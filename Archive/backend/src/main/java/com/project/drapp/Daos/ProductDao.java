package com.project.drapp.Daos;

import com.project.drapp.Models.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ProductDao extends CrudRepository<Product,String> {

    @Query(value = "SELECT * from products WHERE seller = ?1",nativeQuery = true)
    List<Product> findItemsBySeller(String sellerId);

    @Query(value = "UPDATE products SET desc = ?1,name = ?2,quantity= ?3 WHERE id = ?4",nativeQuery = true)
    void updateItem(String desc,String name,String quantity,String id);
}
