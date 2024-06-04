jQuery(document).ready(function ($) {

    // Variables to store the fetched data
    var modalContent = '';
    var responseData = null;


    // Function to make AJAX call and store the response data
    function fetchPathaoStatus() {
        try {
            // Get order ID and contact number from the button data attributes
            var orderId = $('#pathao-status-check').data('order-id');
            var contactNumber = $('#pathao-status-check').data('contact-number');


            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'woo_pathao_check_order_status',
                    order_id: orderId,
                    contact_number: contactNumber
                },
                success: function (response) {
                    if (response.success) {
                        // console.log('Pathao Status:', response.data.status);

                        // Store response data
                        if (response.data.status.data && response.data.status.data.customer) {
                            responseData = response.data.status.data.customer;
                            // console.log(responseData);

                            if (responseData.total_delivery == 0) {
                                var mobile_number = responseData.customer_number;
                                modalContent = "For " + mobile_number + ', Customer still has no order history';
                            } else {
                                var keyMapping = {
                                    successful_delivery: 'Successful Delivery',
                                    total_delivery: 'Total Delivery'
                                };

                                var totalDelivery = responseData.total_delivery;
                                var totalSuccessfulDelivery = responseData.successful_delivery;
                                var totalCanceled = totalDelivery - totalSuccessfulDelivery;

                                $.each(responseData, function (key, value) {
                                    if (keyMapping.hasOwnProperty(key) && value !== null) {
                                        modalContent += '<div class="pathao-order-data-line"><strong>' + keyMapping[key] + ':</strong><div>' + value + '</div></div>';
                                    }
                                });

                                modalContent += '<div class="pathao-order-data-line"><strong>Total Cancel:</strong><div>' + totalCanceled + '</div></div>';
                                orderBar(totalSuccessfulDelivery, totalCanceled);

                            }
                        } else {
                            modalContent = '<h2>No customer data available</h2>';

                        }
                        $('#pathao-status-check').prop('disabled', false);
                        $('#pathao-status-check').click();
                        $('#pathao-status-check').html('Customer Order Status');






                    } else {
                        alert('Failed to retrieve Pathao status.');

                    }
                },
                error: function () {
                    alert('Failed to retrieve Pathao status.');
                }
            });
        }
        catch (err) {
            console.log(err)

        }
    }

    // Automatically fetch Pathao status on page load
    fetchPathaoStatus();

    // Open modal when button is clicked
    $('#pathao-status-check').on('click', function () {
        $('#pathao-response-data').html(modalContent);
        $('#pathao-response-modal').css('display', 'block');

    });

    // Close modal when close button is clicked
    $('.close').on('click', function () {
        $('#pathao-response-modal').css('display', 'none');
        // $('#pathao-order-status').css('margin-top', '20px');
        // $('#pathao-status-check').css('display', 'block');
        // $('#pathao-status-check').css('margin-top', '20px');
    });

    function orderBar(successful, canceled) {
        var total = successful + canceled;
        var successPercent = (successful / total) * 100;
        var cancelPercent = (canceled / total) * 100;

        $('#pathao-dataBar').empty(); // Clear previous data

        if (successPercent > 0) {
            var successDiv = $('<div class="order-successDiv"></div>').css({
                'width': successPercent + '%'
            }).text(successPercent.toFixed(2) + '%');
            $('#pathao-dataBar').append(successDiv);
        }

        if (cancelPercent > 0) {
            var cancelDiv = $('<div class="order-cancelDiv"></div>').css({
                'width': cancelPercent + '%'
            });
            $('#pathao-dataBar').append(cancelDiv);
        }
    }
    // Function to make AJAX call and replace button with successful delivery percentage
    function fetchPathaoStatusforOrderTable(contactNumber, button) {
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'woo_pathao_check_order_status',
                contact_number: contactNumber
            },
            success: function (response) {
                if (response.success) {
                    if (response.data.status.data && response.data.status.data.customer) {
                        var responseData = response.data.status.data.customer;
                        if (responseData.total_delivery == 0) {
                            var mobile_number = responseData.customer_number;
                            $(button).replaceWith("<p>For " + mobile_number + ", Customer still has no order history</p>");
                        } else {
                            var totalDelivery = responseData.total_delivery;
                            var totalSuccessfulDelivery = responseData.successful_delivery;
                            var totalSuccessfulDeliveryParcent = (totalSuccessfulDelivery / totalDelivery) * 100;
                            $(button).replaceWith("<p>Successful Delivery: " + totalSuccessfulDeliveryParcent.toFixed(2) + "%</p>");
                        }
                    } else {
                        $(button).replaceWith("<p>No customer data available</p>");
                    }
                } else {
                    alert('Failed to retrieve Pathao status.');
                }
            },
            error: function () {
                alert('Failed to retrieve Pathao status.');
            }
        });
    }

    $(document).on('click', '#pathao-status-check-for-order-page', function (e) {
        e.preventDefault();
        var contactNumber = $(this).data('contact-number');
        fetchPathaoStatusforOrderTable(contactNumber, this);
    });
});
