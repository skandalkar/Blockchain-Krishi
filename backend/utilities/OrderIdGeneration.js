const generateOrderId = () => {
    let role = "Order"; // Fixed role for order ID generation
    const prefix = role.slice(0,3).toLowerCase(); // order -> ord
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hour = pad(now.getHours());
    const min = pad(now.getMinutes());
    
    return `${prefix}${day}${month}${year}${hour}${min}`;
};

module.exports = generateOrderId;