import loading from "../../assets/loading.gif";

import "./loading.css";

export default function Loading() {
    return (
        <div className="loading">
            <img src={loading} alt="" />
        </div>
    )
}