import { Navigate, Route, Routes } from "react-router-dom";
import NotFound from "../not-found/NotFound";
import Forbidden from "../../auth/forbidden/Forbidden";
import Vacations from "../../vacations/vacation/Vacation";
import Admin from "../../admin/admin/Admin";
import NewVacation from "../../admin/new copy/NewVacation";

export default function Main() {
    return (

        <Routes>
            <Route path="/" element={<Navigate to="/vacations" />} />
            <Route path="/vacations" element={<Vacations />} />
            <Route path="/vacations/manage" element={<Admin />} />
            <Route path="/add-vacation" element={<NewVacation />} />
            {/* <Route path="/vacation/edit/:id" element={<EditVacation />} />
            <Route path="/vacation/delete/:id" element={<Vacations/>} /> */}
            <Route path="/Forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
