import { Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ListProjects from "./pages/ListProjects";
import EditProject from "./pages/EditProject";
import ListLogs from "./pages/ListLogs";

import { RequireAuth } from "./helpers/RequireAuth";

export const AllRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                //element={<Home />}
                element={<RequireAuth><Home /></RequireAuth>}
            />
            <Route
                path="/register"
                element={<RequireAuth><Register /></RequireAuth>}
            />
            <Route
                path="/listProjects"
                element={<RequireAuth><ListProjects /></RequireAuth>}
            />
            <Route
                path="/listLogs"
                element={<RequireAuth><ListLogs /></RequireAuth>}
            />
            <Route
                path="/project/:id"
                element={<RequireAuth><EditProject /></RequireAuth>}
            />


            <Route path="/login"
                element={<Login />}
            />

            <Route path="/signUp"
                element={<SignUp />}
            />

            <Route path="*"
                element={<NotFound />}
            />
        </Routes>
    )
}