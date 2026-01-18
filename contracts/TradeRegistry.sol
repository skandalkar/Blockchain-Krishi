// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract TradeRegistry {
    struct Order {
        uint256 id;
        address farmer;
        address buyer;
        string orderId;
        string crop;
        uint256 price; // Price per unit
        uint256 quantity;
        uint256 totalCost;
        uint256 timestamp;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    // This event is the "bridge" to your Backend
    event OrderFinalized(
        uint256 id,
        address indexed farmer,
        address indexed buyer,
        string orderId,
        string crop,
        uint256 price,
        uint256 quantity,
        uint256 totalCost,
        uint256 timestamp
    );

    function createOrder(
        address _buyer,
        string memory _orderId,
        string memory _crop,
        uint256 _price,
        uint256 _quantity,
        uint256 _totalCost
    ) public {
        orderCount++;

        orders[orderCount] = Order(
            orderCount,
            msg.sender,
            _buyer,
            _orderId,
            _crop,
            _price,
            _quantity,
            _totalCost,
            block.timestamp
        );

        emit OrderFinalized(
            orderCount,
            msg.sender,
            _buyer,
            _orderId,
            _crop,
            _price,
            _quantity,
            _totalCost,
            block.timestamp
        );
    }
}