const transferStatus = {
    1: "Draft",
    2: "Submitted",
    3: "Processing",
    4: "Complete",
    5: "Waiting",
    7: "Canceled"
}

const transferId = {
    Draft: 1,
    Submitted: 2,
    Processing: 3,
    Complete: 4,
    Waiting: 5,
    Canceled: 7
}

const transferTypeId ={
    1: "Receipt",
    2: "Delivery"
}

const transferType = {
    Receipt: 1,
    Delivery: 2,
}

const billStatus = {
    1: "Pending",
    2: "Submitted",
    3: "Closed"
}

const roleGroupId = {
    Admin: 1,
    User: 2
}

const sortType = {
    1: "ASC",
    2: "DESC",
}

const sheetId = {
    A: "name",
    B: "category_name",
    C: "sku",
}

const movementType = {
    1: "In",
    2: "Out",
    3: "Inventory Adjustment"
};

const connectionStatus = {
    success: "success",
    failed: "failed"
}

export { transferStatus, transferType, transferTypeId, transferId, billStatus, roleGroupId, sortType, sheetId, movementType, connectionStatus };

