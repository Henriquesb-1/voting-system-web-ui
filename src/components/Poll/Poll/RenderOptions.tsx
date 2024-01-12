import { useEffect, useState } from "react";
import Option from "../../../model/Option";
import FeedBack from "../../../utils/Feedback";

import "./renderOptions.css";

interface RenderOptionsProps {
    options: Option[];
    hasExpired: boolean;
}

const blankOption: Option = { id: 0, content: "", voteCount: 0, pollId: 0 };

export default function RenderOptions({ options, hasExpired }: RenderOptionsProps) {
    const [optionVoted, setOptionVoted] = useState<Option>(blankOption);
    const [hasAlreadyVoted, setHasAlreadyVoted] = useState<boolean>(false);

    useEffect(() => {
        const lastOptionVoted = localStorage.getItem("last_vote") || "";

        if(lastOptionVoted) {
            setOptionVoted(JSON.parse(lastOptionVoted));
            setHasAlreadyVoted(true);
        }
    }, [])

    function selectOption(option: Option) {
        if (option === optionVoted) setOptionVoted(blankOption);
        else setOptionVoted(option);
    }

    function vote() {
        
    }

    function removeVote() {
        selectOption(blankOption);
        localStorage.removeItem("last_vote");
        setHasAlreadyVoted(false);
        FeedBack.success("Voto removido");
    }

    function renderOptions() {
        return options.map(option => {
            return (
                <li onClick={e => hasExpired ? false : selectOption(option)} key={`option-item-${option.content}`} className="poll-vote-option margin-y" style={{ backgroundColor: `${optionVoted.id === option.id ? "#f00" : ""}` }}>
                    {option.content}

                    <span>{option.voteCount} votos</span>
                </li>
            )
        })
    }

    return (
        <ul className="poll-vote-list flex-column-center">
            {renderOptions()}

            {optionVoted !== blankOption || hasAlreadyVoted && !hasExpired ? (
                <div>
                    <button onClick={e => hasAlreadyVoted ? removeVote() : vote()} className="clean-button">{hasAlreadyVoted ? "Remover voto" : "Votar"}</button>
                </div>
            ) : false}
        </ul>
    )
}