import express from "express"
import config from './config'
import cors from 'cors'
//Middlewares
import { checkPermissions } from "./middlewares/permissions"
import boolParser from './middlewares/parseBoolean';
import trimResponses from "./middlewares/trimResponses";
//Routes
import AnnotationTypesRoutes from './routes/AnnotationTypes.routes'
import AppDocumentsRoutes from './routes/AppDocuments.routes'
import AppFunctionsRoutes from './routes/AppFunctions.routes'
import ConcatsRoutes from './routes/Contacts.routes'
import DocumentTypesRoutes from './routes/DocumentTypes.routes'
import GroupsRoutes from './routes/Groups.routes'
import TechniciansRoutes from './routes/Technicians.routes'
import UsersRoutes from './routes/Users.routes'
import VehicleManufactersRoutes from './routes/VehicleManufacters.routes'
import VehicleLinesRoutes from './routes/VehicleLines.routes'
import VehicleYearsRoutes from './routes/VehicleYears.routes'
import VehicleEnginesRoutes from './routes/VehicleEngines.routes'
import VehiclePlateTypesRoutes from './routes/VehiclePlateTypes.routes'
import VehicleMembershipTypesRoutes from './routes/VehicleMembershipTypes.routes'
import VehicleRoutes from './routes/Vehicles.routes'
import VehicleContactsRoutes from './routes/VehicleContacts.routes'
import VehicleMembershipsRoutes from './routes/VehicleMemberships.routes'
import VehicleFuelTypesRoutes from './routes/VehicleFuelTypes.routes'
import UserAppDocumentsRoutes from './routes/UserAppDocuments.routes'
import UserAssignedGroupsRoutes from './routes/UserAssignedGroups.routes'
import GroupAppFunctionsRoutes from './routes/GroupAppFunctions.routes'
import OrdersRoutes from './routes/Orders.routes'
import OrderStatesRoutes from './routes/OrderStates.routes'
import ProductsRoutes from './routes/Products.routes'
import ServicesRoutes from './routes/Services.routes'
import OrderProductsRoutes from './routes/OrderProducts.routes'
import OrderServicesRoutes from './routes/OrderServices.routes'
import OrderDocumentsRoutes from './routes/OrderDocuments.routes'
import OrderAnntonationsRoutes from './routes/OrderAnnotations.routes'
import LoginRoutes from './routes/Login.routes'
import OrderAnnotationDetailsRoutes from './routes/OrderAnnotationDetails.routes'
import BulkProductOpeningsRoutes from "./routes/BulkProductOpenings.routes";
import BulkProductOutsRoutes from "./routes/BulkProductOuts.routes";
import BulkProductOutAnnullationsRoutes from './routes/BulkProductOutAnnullations.routes'

//OfimaRoutes
import CashRegisterRoutes from "./routes/Ofima/CashRegister.routes"
import CostCenterRoutes from "./routes/Ofima/CostCenter.routes"
import CustomerRoutes from "./routes/Ofima/Customer.routes"
import OfimaDocumentTypeRoutes from "./routes/Ofima/OfimaDocumentType.routes"
import PaymentMethodRoutes from "./routes/Ofima/PaymentMethod.routes"
import InvoiceRoutes from "./routes/Ofima/Invoice.routes"
import StoreRoutes from "./routes/Ofima/Store.routes"

const app = express()

//settings
app.use(cors());
app.use(express.static('uploads'));
app.set('port', config.port)

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(checkPermissions)
app.use(boolParser)
app.use(trimResponses)

//routes
app.use(AnnotationTypesRoutes)
app.use(AppDocumentsRoutes)
app.use(ConcatsRoutes)
app.use(DocumentTypesRoutes)
app.use(GroupsRoutes)
app.use(ProductsRoutes)
app.use(ServicesRoutes)
app.use(TechniciansRoutes)
app.use(UsersRoutes)
app.use(VehicleManufactersRoutes)
app.use(VehicleLinesRoutes)
app.use(VehicleYearsRoutes)
app.use(VehicleEnginesRoutes)
app.use(VehiclePlateTypesRoutes)
app.use(VehicleMembershipTypesRoutes)
app.use(VehicleRoutes)
app.use(VehicleContactsRoutes)
app.use(VehicleMembershipsRoutes)
app.use(UserAppDocumentsRoutes)
app.use(UserAssignedGroupsRoutes)
app.use(AppFunctionsRoutes)
app.use(GroupAppFunctionsRoutes)
app.use(OrdersRoutes)
app.use(OrderStatesRoutes)
app.use(OrderProductsRoutes)
app.use(OrderServicesRoutes)
app.use(OrderDocumentsRoutes)
app.use(OrderAnntonationsRoutes)
app.use(OrderAnnotationDetailsRoutes)
app.use(LoginRoutes)
app.use(BulkProductOpeningsRoutes)
app.use(BulkProductOutsRoutes)
app.use(BulkProductOutAnnullationsRoutes)
app.use(VehicleFuelTypesRoutes)
//
app.use(CashRegisterRoutes)
app.use(CostCenterRoutes)
app.use(CustomerRoutes)
app.use(OfimaDocumentTypeRoutes)
app.use(PaymentMethodRoutes)
app.use(InvoiceRoutes)
app.use(StoreRoutes)

export default app