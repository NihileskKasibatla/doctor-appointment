package com.project.drapp.Daos;

import com.project.drapp.Models.Appointment;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AppointmentDao extends CrudRepository<Appointment,String> {

    @Query(value = "SELECT * from appointments WHERE user_email = ?1 OR doctor_email = ?1",nativeQuery = true)
    List<Appointment> findAppointmentByEmail(String email);
}
