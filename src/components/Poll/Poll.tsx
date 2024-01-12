import { useEffect, useState } from "react";
import PollModel from "../../model/Poll";
import APICall from "../../utils/APICall";
import PollStatus from "../../model/PollStatus";

import "./poll.css";

export default function Poll() {
    const [polls, setPolls] = useState<PollModel[]>([]);

    useEffect(() => {
        APICall.get(`/poll`)
            .then(resp => {
                const { data } = resp;
                setPolls(data.data);
            });
    })

    function renderPolls() {
        return polls.map((poll, index) => {
            return (
                <div className="poll flex-column-between margin-y" key={`poll-item-${poll._id}`}>
                    <div className="poll-title">
                        <h3>{poll._title}</h3>
                    </div>

                    <div className="poll-start-date">
                        <span>
                            {poll._status === PollStatus.EXPIRED || poll._status === PollStatus.IN_CURSE ? `Iniciou em ${poll._startDate}` : `Inicia em ${poll._startDate}`}
                        </span>
                    </div>

                    <div className="poll-end-date">
                        <span>
                            {poll._status === PollStatus.EXPIRED ? `Terminou em ${poll._endDate}` : `Termina em ${poll._endDate}`}
                        </span>
                    </div>

                    <div className="poll-link">
                        <button style={{ color: "#000" }}
                            disabled={poll._status === PollStatus.EXPIRED || poll._status === PollStatus.WILL_START}
                            title={poll._status === PollStatus.WILL_START ? `Irá ficar disponivel em ${poll._startDate}` : `Acessar enquete ${poll._title}`}
                            className="clean-button"
                        >
                            Acessar enquete
                        </button>
                    </div>
                </div>
            )
        })
    }

    return (
        <div className="polls margin-y">
            {renderPolls()}
        </div>
    )
}