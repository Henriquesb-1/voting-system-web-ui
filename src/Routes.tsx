import { Route, Routes } from "react-router";

export default function RoutesControl() {
    return (
        <Routes>
            <Route path="/" element={<h1>Olá</h1>} />
        </Routes>
    )
}