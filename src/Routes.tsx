import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Poll from "./pages/Poll";
import Register from "./pages/Register";

export default function RoutesControl() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poll/:title" element={<Poll />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    )
}