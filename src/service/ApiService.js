import TransferServices from "./mini_services/TransferServices"
import RecipientServices from "./mini_services/RecipientServices"
import AuthServices from "./mini_services/AuthServices"
import ProductServices from "./mini_services/ProductServices"

export default {
    ...TransferServices,
    ...RecipientServices,
    ...AuthServices,
    ...ProductServices
}