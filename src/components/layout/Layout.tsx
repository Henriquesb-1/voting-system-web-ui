import Footer from "./Footer";
import Header from "./Header";

import "./layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app">
            <Header />

            <main className="content">
                {children}
            </main>

            <Footer />
        </div>
    )
}