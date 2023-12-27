package com.project.drapp.Daos;

import com.project.drapp.Models.Doctor;
import com.project.drapp.Models.Product;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface DoctorDao extends CrudRepository<Doctor,String> {

    @Query(value = "SELECT * from doctor WHERE email = ?1",nativeQuery = true)
    List<Doctor> findDoctorFromEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "UPDATE doctor SET rating = ?1 WHERE email = ?2",nativeQuery = true)
    void updateDoctorRating(int rating,String email);
}
