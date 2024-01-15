import error from "../../assets/error.png";

import "./error.css";

export default function Error() {
    return (
        <div className="error-screen">
            <div>
                <img src={error} alt="" />
            </div>

            <h3>Erro ao carregar conteudo, por favor, volte mais tarde</h3>
        </div>
    )
}