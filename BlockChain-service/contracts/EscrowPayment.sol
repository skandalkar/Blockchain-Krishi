// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract EscrowPayment {
    enum Status {
        PENDING,
        DELIVERED
    }
    
    struct Payment {
        address farmer;
        address buyer;
        uint256 orderId;
        Status status;
    }

    mapping(uint256 => Payment) public payments;

    event FundDeposited(
        uint256 indexed orderId,
        address buyer,
        address farmer
    );

    event DeliveryConfirmed(
        uint256 indexed orderId,
        address buyer,
        address farmer
    );

    // Register escrow reference on blockchain
    function deposit(
        uint256 _orderId,
        address _buyer,
        address _farmer
    ) external {

        require(payments[_orderId].orderId == 0, "Order already exists");

        payments[_orderId] = Payment({
            farmer: _farmer,
            buyer: _buyer,
            orderId: _orderId,
            status: Status.PENDING
        });

        emit FundDeposited(_orderId, _buyer, _farmer);
    }

    // Buyer confirms delivery
    function confirmDelivery(uint256 _orderId) external {

        Payment storage payment = payments[_orderId];

        require(msg.sender == payment.buyer, "Only buyer can confirm");
        require(payment.status == Status.PENDING, "Invalid order status");

        payment.status = Status.DELIVERED;

        emit DeliveryConfirmed(_orderId, payment.buyer, payment.farmer);
    }
}