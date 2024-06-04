<?php
if ( ! class_exists( 'Woo_pathao_Admin_Assets', false ) ) :
    class Woo_pathao_Admin_Assets {

        /**
         * Hook in tabs.
         */
        public function __construct() {
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_styles' ) );
            add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_scripts' ) );
        }

        /**
         * Enqueue admin styles.
         */
        public function enqueue_admin_styles() {
            wp_register_style( 'woo_pathao_admin_styles', plugin_dir_url( __FILE__ ) . 'includes/assets/css/style.css', array() );
            wp_register_style( 'woo_pathao_admin_jquery_modalstyles', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css', array() );

            wp_style_add_data( 'woo_pathao_admin_styles', 'rtl', 'replace' );
            wp_enqueue_style( 'woo_pathao_admin_styles' );
            wp_enqueue_style( 'woo_pathao_admin_jquery_modalstyles' );
        }

        /**
         * Enqueue admin scripts.
         */
        public function enqueue_admin_scripts() {
            // Enqueue jQuery
            wp_enqueue_script('jquery');

            // Enqueue custom script with localized data
            wp_enqueue_script('woo-pathao-order-script', plugin_dir_url( __FILE__ ) . 'includes/assets/js/script.js', array('jquery'), '1.0', true);
            wp_enqueue_script('woo-pathao-order-modal-jquery', 'https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js', array('jquery'), '1.0', true);
            wp_enqueue_script('woo-pathao-order-modal-canvas-jquery', 'https://cdn.canvasjs.com/jquery.canvasjs.min.js', array('jquery'), '1.0', true);

            // Localize script with data
            wp_localize_script('woo-pathao-order-script', 'woo_custom_fields_ajax', array('ajaxurl' => admin_url('admin-ajax.php')));
        }
    }
endif;

return new Woo_pathao_Admin_Assets();
