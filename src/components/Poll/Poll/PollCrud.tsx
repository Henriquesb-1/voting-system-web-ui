import { useState } from "react";
import PollMode from "../../../model/PollMode";
import Poll from "../../../model/Poll";
import RenderPoll from "./RenderPoll";
import PollStatus from "../../../model/PollStatus";
import UpdatePoll from "./UpdatePoll";

const blankPoll: Poll = { _id: 0, _title: "", _startDate: "", _endDate: "", _options: [], _status: PollStatus.IN_CURSE };

export default function PollCrud() {
    const [pollMode, setPollMode] = useState<PollMode>(PollMode.RENDER);
    const [pollToDeleteOrUpdate, setPollToDeleteOrUpdate] = useState<Poll>(blankPoll);

    function renderPollCrud() {
        switch(pollMode) {
            case PollMode.RENDER:
                return <RenderPoll setPollMode={setPollMode} setPollToDeleteOrUpdate={setPollToDeleteOrUpdate} />

            case PollMode.UPDATE:
                return <UpdatePoll poll={pollToDeleteOrUpdate} setPollMode={setPollMode} />
        }
    }

    return <>{renderPollCrud()}</>
}