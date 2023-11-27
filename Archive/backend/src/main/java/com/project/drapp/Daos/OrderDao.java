package com.project.drapp.Daos;

import com.project.drapp.Models.Orders;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

public interface OrderDao extends CrudRepository<Orders,String> {

    @Query(value = "SELECT * from orders WHERE user_id = ?1",nativeQuery = true)
    List<Orders> findUserOrders(String userId);

    @Query(value = "SELECT * FROM orders WHERE seller_id like %?1%",nativeQuery = true)
    List<Orders> findHotelOrders(String hotelId);

    @Query(value = "SELECT * FROM orders WHERE status like '4'",nativeQuery = true)
    List<Orders> findCanceledOrders(String hotelId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE orders SET status = ?1 WHERE id = ?2",nativeQuery = true)
    void updateOrderStatus(int status,String orderId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE orders SET status = '4' WHERE id = ?1",nativeQuery = true)
    void cancelOrder(String orderId);

}
