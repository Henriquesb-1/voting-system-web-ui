import { Dispatch, SetStateAction, useEffect, useState } from "react";
import APICall from "../../../utils/APICall";
import Option from "../../../model/Option";
import FeedBack from "../../../utils/Feedback";

import "./renderOptions.css";

interface RenderOptionsProps {
    pollId: number;
    options: Option[];
    setOptions: Dispatch<SetStateAction<Option[]>>;
    hasExpired: boolean;
}

const blankOption: Option = { id: 0, content: "", voteCount: 0, pollId: 0 };

export default function RenderOptions({ pollId, options, setOptions, hasExpired }: RenderOptionsProps) {
    const [optionVoted, setOptionVoted] = useState<Option>(blankOption);
    const [hasAlreadyVoted, setHasAlreadyVoted] = useState<boolean>(false);

    useEffect(() => {
        const lastOptionVoted = localStorage.getItem("last_vote") || "";

        if (lastOptionVoted) {
            setOptionVoted(JSON.parse(lastOptionVoted));
            setHasAlreadyVoted(true);
        }
    }, [])

    function selectOption(option: Option) {
        if (option === optionVoted) setOptionVoted(blankOption);
        else setOptionVoted(option);
    }

    function handleVote() {
        const voteCount = hasAlreadyVoted ? optionVoted.voteCount - 1 : optionVoted.voteCount + 1;

        APICall.put(`/options`, { id: optionVoted.id, content: optionVoted.content, voteCount, poll: { id: pollId }, willUpdateVoteCount: true })
            .then(resp => {
                const updatedOptionVoted = { id: optionVoted.id, content: optionVoted.content, voteCount, pollId: optionVoted.pollId }

                setOptions(options.map(option => {
                    if (option.id === updatedOptionVoted.id) option.voteCount = voteCount;
                    return option;
                }))

                if (hasAlreadyVoted) {
                    selectOption(blankOption);
                    setOptionVoted({ id: optionVoted.id, content: optionVoted.content, voteCount, pollId: optionVoted.pollId });
                    localStorage.removeItem("last_vote");
                    setHasAlreadyVoted(false);
                    FeedBack.success("Voto removido");
                } else {
                    setHasAlreadyVoted(true);
                    setOptionVoted(updatedOptionVoted);
                    localStorage.setItem("last_vote", JSON.stringify(updatedOptionVoted));
                    FeedBack.success("Voto registrado com sucesso");
                }
            })
            .catch(err => FeedBack.error("Erro ao registrar voto"));
    }

    function renderOptions() {
        return options.map(option => {
            return (
                <li onClick={e => hasExpired || hasAlreadyVoted ? false : selectOption(option)} key={`option-item-${option.content}`} className="poll-vote-option margin-y" style={{ backgroundColor: `${optionVoted.id === option.id ? "#f00" : ""}` }}>
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
                    <button onClick={e => handleVote()} className="clean-button">{hasAlreadyVoted ? "Remover voto" : "Votar"}</button>
                </div>
            ) : false}
        </ul>
    )
}