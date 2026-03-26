// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract TradeRegistry {
    struct Order {
        uint256 id;
        address farmer;
        address buyer;
        string orderId;
        string crop;
        uint256 price;  // Price per Unit
        uint256 quantity;
        uint256 totalCost;
        uint256 timestamp;
        string status;
        string dataFingerprint;
    }

    mapping(uint256 => Order) public orders;
    uint256 public orderCount;

    event OrderFinalized(
        uint256 id,
        address indexed farmer,
        address indexed buyer,
        string orderId,
        string crop,
        uint256 price,
        uint256 quantity,
        uint256 totalCost,
        uint256 timestamp,
        string status
    );

    event OrderUpdated(
        uint256 id,
        string orderId,
        string status,
        string dataFingerprint
    );

    function createOrder(
        address _farmer,
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
            _farmer,
            _buyer,
            _orderId,
            _crop,
            _price,
            _quantity,
            _totalCost,
            block.timestamp,
            "PENDING",
            ""
        );

        emit OrderFinalized(
            orderCount,
            _farmer,
            _buyer,
            _orderId,
            _crop,
            _price,
            _quantity,
            _totalCost,
            block.timestamp,
            "PENDING"
        );
    }

    function updateOrderStatus(
        uint256 _id,
        string memory _status,
        string memory _dataFingerprint
    ) public {
        Order storage order = orders[_id];

        require(msg.sender == order.buyer, "Only buyer can update");

        order.status = _status;
        order.dataFingerprint = _dataFingerprint;

        emit OrderUpdated(_id, order.orderId, _status, _dataFingerprint);
    }
}