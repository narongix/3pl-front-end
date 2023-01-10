export default class TransferService {

    getTransfers() {
        return fetch('data/transfers.json').then(res => res.json()).then(d => d.data);
    }
    getTransferDetails(id) {
        let data = fetch('data/transfers-details.json').then(res => res.json()).then(d =>Array.from(d.data).filter(transfer => transfer.id  == id));
        // let filteredData = Array.from(data);=
        console.log(id);
        
        return data;
    }
} 

