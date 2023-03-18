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

const transferType ={
    1: "Receipt",
    2: "Delivery"
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

export { transferStatus, transferType, transferId, billStatus, roleGroupId };

