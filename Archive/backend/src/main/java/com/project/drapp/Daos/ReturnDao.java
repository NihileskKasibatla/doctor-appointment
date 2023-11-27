package com.project.drapp.Daos;

import com.project.drapp.Models.OrderReturnRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ReturnDao extends CrudRepository<OrderReturnRequest,String> {

    @Query(value = "SELECT * FROM returns WHERE seller_id like %?1%",nativeQuery = true)
    List<OrderReturnRequest> findReturnedOrders(String hotelId);
}
