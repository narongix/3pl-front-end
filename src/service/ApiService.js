import TransferServices from "./mini_services/TransferServices"
import RecipientServices from "./mini_services/RecipientServices"
import AuthServices from "./mini_services/AuthServices"
import ProductServices from "./mini_services/ProductServices"
import StockDetailReportService from "./mini_services/StcokDetailReportService"
import BillingServices from "./mini_services/BillingServices"

export default {
    ...TransferServices,
    ...RecipientServices,
    ...AuthServices,
    ...ProductServices,
    ...StockDetailReportService,
    ...BillingServices
}