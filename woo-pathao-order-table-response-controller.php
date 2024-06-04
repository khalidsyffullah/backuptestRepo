<?php 
//woo-pathao-order-table-response-controller.php
add_filter('manage_woocommerce_page_wc-orders_columns', 'populate_order_items_column_for_pathao' , 25, 2); 
add_action('manage_woocommerce_page_wc-orders_custom_column', 'populate_order_items_column_data_for_pathao' , 25, 2); 


add_filter('manage_edit-shop_order_columns', 'populate_order_items_column_for_pathao' , 25, 2); 
add_action('manage_shop_order_posts_custom_column', 'populate_order_items_column_data_for_pathao' , 25, 2); 



function populate_order_items_column_for_pathao( $columns ) {
	$columns[ 'pathao_status_column' ] = 'Pathao Status';
	return $columns;
	
};


   function populate_order_items_column_data_for_pathao($column, $post_id){
   
    if ('pathao_status_column' === $column) {
        // Get the order object
        $order = wc_get_order($post_id);

        // Get the billing phone number
        $billing_phone = $order->get_billing_phone();

        // Output the button with the data attribute containing the billing phone number
        echo '<button class="button" id = "pathao-status-check-for-order-page" data-contact-number="' . esc_attr($billing_phone) . '">Check Pathao Status</button>';
    }
};