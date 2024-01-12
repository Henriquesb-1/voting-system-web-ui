import { useEffect, useState } from "react";
import PollStatus from "../../../model/PollStatus";
import Poll from "../../../model/Poll";
import APICall from "../../../utils/APICall";
import RenderOptions from "./RenderOptions";

import "./renderPoll.css"
import Option from "@/model/Option";

interface RenderPollProps {
    title: string;
}

const blankPoll: Poll = { _id: 0, _title: "", _startDate: "", _endDate: "", _options: [], _status: PollStatus.IN_CURSE };

export default function RenderPoll({ title }: RenderPollProps) {
    const [poll, setPoll] = useState<Poll>(blankPoll);
    const [options, setOptions] = useState<Option[]>([]);

    useEffect(() => {
        APICall.get(`/poll/title?t=${title}?`)
            .then(resp => {
                setPoll(resp.data);
                setOptions(resp.data._options);
            })
            .catch(err => console.log(err))
    }, [])

    function renderPoll() {
        return (
            <div className="poll-vote">
                <div className="poll-title">
                    <h2>{poll._title}</h2>
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

                <div className="options">
                    <RenderOptions options={options} setOptions={setOptions} hasExpired={poll._status === PollStatus.EXPIRED} />
                </div>
            </div>
        )
    }

    return (
        <div className="flex-row-center margin-y">
            {renderPoll()}
        </div>
    )
}