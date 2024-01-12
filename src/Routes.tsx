import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Poll from "./pages/Poll";

export default function RoutesControl() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/poll/:title" element={<Poll />} />
        </Routes>
    )
}