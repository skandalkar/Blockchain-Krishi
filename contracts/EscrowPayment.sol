// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EscrowPayment {
    enum Status {
        PENDING,
        DELIVERED,
        CANCELLED
    }

    struct Payment {
        address farmer;
        address buyer;
        uint256 amount;
        Status status;
        bool isCompleted;
    }

    mapping(uint256 => Payment) public payments;

    event FundDeposited(uint256 indexed orderId, address buyer, uint256 amount);
    event FundReleased(uint256 indexed orderId, address farmer, uint256 amount);

    // 1. Buyer creates the deal and locks the money in the contract
    function deposit(uint256 _orderId, address _farmer) external payable {
        require(msg.value > 0, "Must send money to escrow");
        require(payments[_orderId].amount == 0, "Order already exists");

        payments[_orderId] = Payment({
            farmer: _farmer,
            buyer: msg.sender,
            amount: msg.value,
            status: Status.PENDING,
            isCompleted: false
        });

        emit FundDeposited(_orderId, msg.sender, msg.value);
    }

    // 2. Buyer confirms receipt, triggering automatic transfer to farmer
    function confirmDelivery(uint256 _orderId) external {
        Payment storage payment = payments[_orderId];

        require(msg.sender == payment.buyer, "Only buyer can confirm");
        require(payment.status == Status.PENDING, "Order not pending");
        require(!payment.isCompleted, "Payment already done");

        payment.status = Status.DELIVERED;
        payment.isCompleted = true;

        // The actual transfer of money
        (bool success, ) = payable(payment.farmer).call{value: payment.amount}(
            ""
        );
        require(success, "Transfer to farmer failed");

        emit FundReleased(_orderId, payment.farmer, payment.amount);
    }
}
