package com.project.drapp.Daos;

import com.project.drapp.Models.User;
import org.springframework.data.repository.CrudRepository;

public interface UserDao extends CrudRepository<User,String> {
}
