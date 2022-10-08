'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT.UNSIGNED
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      addressId: {
        type: Sequelize.BIGINT.UNSIGNED,
        references: { model: 'addresses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      color: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      side: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      size: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      countOfPages: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      uploadedPages: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      binding: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      numberOfCopies: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      description: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      totalOrderPrice: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      shipmentPrice: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      totalPrice: {
        type: Sequelize.ENUM('deposit', 'withdrawal'),
        allowNull: false
      },
      telegramUploadFile: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      whatsupUploadFile: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      paymentWithGatePackage: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      paymentWithGateWallet: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },
      payment: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },

      /*

      21 	status_id 	int(11) 			No 	None 			Change Change 	Drop Drop 	
      22 	discount_id 	int(11) 			Yes 	NULL 			Change Change 	Drop Drop 	
      23 	discount_percent 	int(11) 			No 	0 			Change Change 	Drop Drop 	
      24 	discount_page 	int(11) 			Yes 	NULL 			Change Change 	Drop Drop 	
      25 	discount_code 	varchar(191) 	utf8mb4_unicode_ci 		Yes 	NULL 			Change Change 	Drop Drop 	
      26 	discount_amount 	int(11) 			No 	0 			Change Change 	Drop Drop 	
      27 	telegram_upload_file 	tinyint(1) 			No 	0 			Change Change 	Drop Drop 	
      28 	whatsup_upload_file 	tinyint(1) 			No 	0 			Change Change 	Drop Drop 	
      29 	confirm_for_send_date 	timestamp 			Yes 	NULL 			Change Change 	Drop Drop 	
      30 	sent_date 	timestamp 			Yes 	NULL 			Change Change 	Drop Drop 	
      31 	complete_date 	timestamp 			Yes 	NULL 			Change Change 	Drop Drop 	
      32 	postal_tracking_code 	varchar(191) 	utf8mb4_unicode_ci 		Yes 	NULL 			Change Change 	Drop Drop 	
      33 	cancel_request 	tinyint(1) 			No 	0 			Change Change 	Drop Drop 	
      34 	cancel_request_reason 	text 	utf8mb4_unicode_ci 		Yes 	NULL 			Change Change 	Drop Drop 	
      35 	cancel_request_approved_by 	int(11) 
*/
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders')
  }
}
