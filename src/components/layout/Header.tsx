import "./header.css";

export default function Header() {
    return (
        <header>
            <div className="header flex-row-around">
                <div>
                    <a href="/" className="clean-link-no-hover" title="Voltar para página inicial">
                        <h1>HB Enquetes</h1>
                    </a>
                </div>

                <div className="links">
                    <div>
                        <a href="/register" className="clean-link" title="Criar nova enquete">
                            Criar nova enquete
                        </a>
                    </div>
                </div>
            </div>
        </header>
    )
}