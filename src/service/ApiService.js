import TransferServices from "./mini_services/TransferServices"
import RecipientServices from "./mini_services/RecipientServices"
import AuthServices from "./mini_services/AuthServices"

export default {
    ...TransferServices,
    ...RecipientServices,
    ...AuthServices
}