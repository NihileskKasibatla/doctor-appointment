package com.project.drapp.Daos;

import com.project.drapp.Models.Doctor;
import com.project.drapp.Models.Product;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface DoctorDao extends CrudRepository<Doctor,String> {

    @Query(value = "SELECT * from doctors WHERE email = ?1",nativeQuery = true)
    List<Doctor> findDoctorFromEmail(String email);
}
