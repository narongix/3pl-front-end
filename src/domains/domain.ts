// export enum TransferType{
//     Receipt = 1,
//     Delivery = 2,
// }

//TODO: Implement Proper Serialization with TypeScript

//     // public static toTransfer(json: Object):TransferProduct{
//     //     return new TransferProduct({
//     //         id: json[id] ?? 
//     //     })
//     // }
// /* eslint-disable */
// // export class Convert{
// //     static toTransferType(json: Object):TransferType{
// //         return new TransferType({
// //             id: json["id"],
// //             name: json["transfer_type_name"]
// //         })
// //     }
// //     static fromTransferType(transferType: TransferType):Object{
// //         return {
// //             transfer_type_id: transferType.id
// //         }
// //     }
// // }

// // interface TransferProductType{
// //     id:number
// //     productId: String
// //     productName: String
// //     demand:number
// //     done: number
// // }

// // class TransferProduct{
// //     constructor({id, productId, productName, demand, done}:TransferProductType){
// //         this.id = id
// //         this.productId = productId
// //         this.productName = productName
// //         this.demand = demand
// //         this.done = done
// //     }

// //     id:number
// //     productId: String
// //     productName: String
// //     demand:number
// //     done: number
// // }

// interface TransferTypeInterface{
//     id: number;
//     name: String;
// }

// class TransferType{
//     constructor({id, name}:TransferTypeInterface){
//         this.id = id
//         this.name = name
//     }
//     id:number;
//     name:String;

//     static toTransferType(json: Object):TransferType{
//         return new TransferType({
//             id: json["id"],
//             name: json["transfer_type_name"]
//         })
//     }

//     static fromTransferType(transferType: TransferType):Object{
//         return {
//             transfer_type_id: transferType.id
//         }
//     } 
// }