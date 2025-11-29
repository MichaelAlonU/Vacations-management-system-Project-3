import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../not-found/NotFound";
import Forbidden from "../../auth/forbidden/Forbidden";
import Vacations from "../../vacations/vacation/Vacation";
import Login from "../../auth/login/Login";
import Signup from "../../auth/signup/Signup";
import Admin from "../../admin/admin/Admin";
import NewVacation from "../../admin/new/NewVacation";
import EditVacation from "../../admin/edit/EditVacation";

export default function Main() {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/vacations" />} />
            {/* <Route path="/login" element={<Login />} /> */} // for logging issues, it's dealt in the layout comp.
            {/* <Route path="/signup" element={<Signup />} /> */} 
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/vacations/manage" element={<Admin />} />
            <Route path="/add-vacation" element={<NewVacation />} />
            <Route path="/vacations/edit/:id" element={<EditVacation />} />
            {/* <Route path="/vacation/delete/:id" element={<Vacations/>} /> */}
            <Route path="/Forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
