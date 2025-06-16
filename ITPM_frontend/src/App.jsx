import './App.css';
import AdminPage from './pages/admin/adminPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/home/homePage';
import LoginPage from './pages/login/login';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/register/register';
import Testing from './components/testing';
import AddPeople from './components/People_mng/placePeople/addPeople';
import People from './components/People_mng/retrievePeople/people';
import EditPeople from './components/People_mng/UpdatePeople/editPeople';
import AddEmployee from './components/placeEmployee/addEmployee';
import Employee from './components/RetriveEmployee/Employee';
import EditEmployee from './components/updateEmployee/editEmployee';
import Order from './pages/Stocks/RetriveOrder/Order';
import AddOrder from './pages/Stocks/placeOrder/AddOrder';
import EditOrder from './pages/Stocks/updateOrder/editOrder';
import Profile from './pages/profile/profile';

import Createticket from './pages/ticket/Createticket';
import Alltickets from './pages/ticket/Alltickets';
import Oneticket from './pages/ticket/Oneticket';
import Deleteticket from './pages/ticket/Deleteticket';
import ReplyTicket from './pages/ticket/ReplyTicket';
import UserTicketReplies from './pages/ticket/UserTicketReplies';


function App() {
 

  return (
<BrowserRouter>
<Toaster position="top-right"/>

  <Routes path="/*"> 
    <Route path = "/testing" element = {<Testing/>}/>
    <Route path = "/admin/*" element = {<AdminPage/>}/>
    <Route path = "/*" element = {<HomePage/>}/>
    <Route path = "/login" element = {<LoginPage/>}/>
    <Route path = "/register" element = {<RegisterPage/>}/>
    <Route path = "/profile" element = {<Profile/>}/>
    
    <Route
                    path="/addpeople"
                    element={<AddPeople />}
                />

    

     <Route
                    path="/editpeople/:id"
                    element={<EditPeople/>}
                /> 

     <Route
                    path="/createemp"
                    element={<AddEmployee />}
                />     

     

      <Route
                    path="/editemp/:id"
                    element={<EditEmployee/>}
                />   

       <Route path="/stocks" element={<Order />} />   
       <Route path="/addstocks" element={<AddOrder />} /> 
       <Route path="/editstocks/:id" element={<EditOrder />} />   

        <Route path ="/tickets" element = {<Alltickets/>}/>
        <Route path ="/createticket" element = {<Createticket/>}/>
        <Route path ="/oneticket/:id" element = {<Oneticket/>}/>
        <Route path ="/deleteticket/:id" element = {<Deleteticket/>}/>
        <Route path="/admin/tickets/reply/:id" element={<ReplyTicket />} />
        <Route path="/replies" element={<UserTicketReplies />} />

  </Routes>
 
 </BrowserRouter>
 

)
}
export default App
