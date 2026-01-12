// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract TradeRegistry {
    struct Order {
        uint256 id;
        address farmer;
        address buyer;
        uint256 price;
        uint256 quantity;
        uint256 timestamp;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    // This event is the "bridge" to your Backend
    event OrderFinalized(
        uint256 indexed orderId,
        address indexed farmer,
        address indexed buyer,
        uint256 price,
        uint256 quantity,
        uint256 timestamp
    );

    function createOrder(
        address _buyer,
        uint256 _price,
        uint256 _quantity
    ) public {
        orderCount++;

        orders[orderCount] = Order(
            orderCount,
            msg.sender,
            _buyer,
            _price,
            _quantity,
            block.timestamp
        );

        emit OrderFinalized(
            orderCount,
            msg.sender,
            _buyer,
            _price,
            _quantity,
            block.timestamp
        );
    }
}
