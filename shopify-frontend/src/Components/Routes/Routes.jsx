import { Route , Routes } from "react-router-dom";
import Product from "../Products/Product";
import Customers from "../Customers/Customers";
import Home from "../Home";
import Protected from "../ProtectedRoutes/ProtectRoutes";
import CustomerPage from "../Customers/CustomerPage";
import AddCustomer from "../Customers/AddCustomer";


const Routers = () => {
    return(
        <Routes>
            <Route path="/product"  element={<Product />}/>
            {/* <Route path="/customers"  element={<Customers />}/> */}
            <Route path="/home"  element={<Home />}/>

            {/* Customer Pages */}
            <Route path="/customer" element={<CustomerPage />}>
                    <Route index element={<Customers />}/>
                    <Route path="addcustomer" element={<AddCustomer />}/>
            </Route>
        </Routes>
    )
}

export default Routers;