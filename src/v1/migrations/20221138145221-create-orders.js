'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable('orders', {
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
        referralId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'referrals', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        discountId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'addresses', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        status: {
          type: Sequelize.ENUM(
            'payment_pending',
            'pending',
            'preparing',
            'canceled',
            'sent'
          ),
          allowNull: false
        },
        amount: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: false
        },
        postageMethod: {
          type: Sequelize.STRING,
          defaultValue: 'پست پیشتاز',
          allowNull: true
        },
        postageFee: {
          type: Sequelize.BIGINT.UNSIGNED,
          defaultValue: 20000,
          allowNull: true
        },
        recipientName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        recipientPhoneNumber: {
          type: Sequelize.STRING,
          allowNull: false
        },
        recipientPostalCode: {
          type: Sequelize.STRING,
          allowNull: false
        },
        recipientDeliveryProvince: {
          type: Sequelize.STRING,
          allowNull: false
        },
        recipientDeliveryCity: {
          type: Sequelize.STRING,
          allowNull: false
        },
        recipientDeliveryAddress: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        discountType: {
          type: Sequelize.STRING,
          allowNull: true
        },
        discountValue: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        discountCode: {
          type: Sequelize.STRING,
          allowNull: true
        },
        discountAmount: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        },
        discountBenefit: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        },
        referralBenefit: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        },
        referralCommission: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        trackingNumber: {
          type: Sequelize.STRING,
          allowNull: true
        },
        cancelReason: {
          type: Sequelize.STRING,
          allowNull: true
        },
        adminId: {
          type: Sequelize.INTEGER.UNSIGNED,
          references: { model: 'admins', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        paymentId: {
          type: Sequelize.BIGINT.UNSIGNED,
          references: { model: 'payments', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: true
        },
        walletPaidAmount: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        },
        gatewayPaidAmount: {
          type: Sequelize.BIGINT.UNSIGNED,
          allowNull: true
        },
        sentAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: true,
          type: Sequelize.DATE
        },
        deletedAt: {
          allowNull: true,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addIndex('orders', ['paymentId'], {
          unique: true
        })
      )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders')
  }
}
