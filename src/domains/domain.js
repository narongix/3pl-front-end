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
const otherErrorCode = {
    100: "unknown",
}
const productnameErrorCode={
    1: "Product Name Cannot Be Empty",
    7: "Product Not yet created",
    8: "Can't Create Product"
};

const demandErrorCode = {
    2: "Demand Cannot be empty",
    3: "Demand Must Contain Number only",
    4: "Demand Cannot be 0",
};

const skuErrorCode = {
    5: "SKU/Internal Reference Cannot Be empty",
    9: "SKU/Internal Reference Already Exists"
}


const errorCode = {
    ...productnameErrorCode,
    ...demandErrorCode,
    ...skuErrorCode,
    ...otherErrorCode
};


const otherErrorCodeName = {
    unknown: 100,
}

const productNameErrorName={
    ProductNameCannotBeEmpty: 1,
    ProductNotYetCreated: 7,
    CantCreateProduct: 8
};

const demandErrorCodeName = {
    DemandCannotBeEmpty: 2,
    DemandMustContainNumberOnly: 3,
    DemandCannotBeZero: 4
};

const skuErrorname = {
    SkuCannotBeEmpty: 5,
    SKUReferenceAlreadyExists: 9
}

const errorName = {
    ...productNameErrorName,
    ...demandErrorCodeName,
    ...skuErrorname,
    ...otherErrorCodeName
};

export { transferStatus, transferType, transferTypeId, transferId, billStatus, roleGroupId, sortType, sheetId, movementType, connectionStatus, errorCode, errorName };

