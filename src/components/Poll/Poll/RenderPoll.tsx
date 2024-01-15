import { useEffect, useState, Dispatch, SetStateAction } from "react";
import PollStatus from "../../../model/PollStatus";
import Poll from "../../../model/Poll";
import PollMode from "../../../model/PollMode";
import APICall from "../../../utils/APICall";
import RenderOptions from "./RenderOptions";
import Option from "../../../model/Option";
import FeedBack from "../../../utils/Feedback";

import "./renderPoll.css";

interface RenderPollProps {
    setPollMode: Dispatch<SetStateAction<PollMode>>;
    setPollToDeleteOrUpdate: Dispatch<SetStateAction<Poll>>;
}

const blankPoll: Poll = { _id: 0, _title: "", _startDate: "", _endDate: "", _options: [], _status: PollStatus.IN_CURSE };

export default function RenderPoll({ setPollMode, setPollToDeleteOrUpdate }: RenderPollProps) {
    const [poll, setPoll] = useState<Poll>(blankPoll);
    const [options, setOptions] = useState<Option[]>([]);

    const [voteHasUpdate, setVoteHasUpdate] = useState<boolean>(false);

    const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);
    const [creatorCode, setCreatorCode] = useState<string>("");
    const [modeToChangeTo, setModeToChangeTo] = useState<PollMode>(PollMode.RENDER);

    useEffect(() => {
        const title = window.location.href.split("/")[4];

        APICall.get(`/poll/title?t=${title}`)
            .then(resp => {
                setPoll(resp.data);
                blankPoll._id = resp.data.id;
                setOptions(resp.data._options);
                setVoteHasUpdate(false);
            })
            .catch(err => console.log(err))
    }, [voteHasUpdate])

    // useEffect(() => {
    //     const title = window.location.href.split("/")[4];

    //     const interval = setInterval(() => {
    //         APICall.get(`/options/listener?pollTitle=${title}`)
    //             .then(resp => setVoteHasUpdate(resp.data))
    //     }, 1000)

    //     return () => clearInterval(interval);
    // }, [])

    function changeMode(mode?: PollMode) {
        setModeToChangeTo(mode || PollMode.RENDER);

        if (!showAuthScreen) {
            setShowAuthScreen(true);
        } else {
            if(creatorCode) {
                if (modeToChangeTo === PollMode.UPDATE) {
                    APICall.post("/poll/auth", { id: poll._id, creatorCode })
                        .then(resp => {
                            setPollMode(modeToChangeTo);
                            setPollToDeleteOrUpdate(poll);
                        })
                        .catch(err => FeedBack.error("Código incorreto"));
                } else if (modeToChangeTo === PollMode.DELETE) {
                    APICall.put(`/poll/delete`, { id: poll._id, creatorCode })
                        .then(resp => {
                            FeedBack.success("Enquete excluida");
                            setInterval(() => window.location.replace("/"), 3000);
                        })
                        .catch(err => FeedBack.error("Código incorreto"));
                }
            } else {
                FeedBack.error("Informe o seu código");
            }
        }
    }

    function renderPoll() {
        return (
            <div className="poll-vote">
                {showAuthScreen ? (
                    <form className="auth-screen">
                        <div>
                            <label htmlFor="creator-code">Informe seu código</label>
                        </div>

                        <div>
                            <input type="text" placeholder="O código que voce criou quando a enquete foi feita" value={creatorCode} onChange={e => setCreatorCode(e.target.value)} />
                        </div>

                        <div className="margin-y flex-row-center">
                            <div className="margin-x">
                                <button style={{ backgroundColor: modeToChangeTo === PollMode.DELETE ? "#f00" : "" }} onClick={e => changeMode()} type="button" className="clean-button" title={modeToChangeTo !== PollMode.DELETE ? "Ir para edição" : "Excluir"}>{modeToChangeTo !== PollMode.DELETE ? "Ir para edição" : "Excluir. Atenção! Essa operação não poderá ser revertida"}</button>
                            </div>

                            <div>
                                <button onClick={e => setShowAuthScreen(false)} type="button" className="clean-button">Cancelar</button>
                            </div>
                        </div>
                    </form>
                ) : false}

                <div className="flex-row-end">
                    <div>
                        <button className="blank-button" onClick={e => changeMode(PollMode.UPDATE)} title="Editar enquete">
                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.65661 17L6.99975 17L6.99975 14M6.10235 14.8974L17.4107 3.58902C18.1918 2.80797 19.4581 2.80797 20.2392 3.58902C21.0202 4.37007 21.0202 5.6364 20.2392 6.41745L8.764 17.8926C8.22794 18.4287 7.95992 18.6967 7.6632 18.9271C7.39965 19.1318 7.11947 19.3142 6.8256 19.4723C6.49475 19.6503 6.14115 19.7868 5.43395 20.0599L3 20.9998L3.78312 18.6501C4.05039 17.8483 4.18403 17.4473 4.3699 17.0729C4.53497 16.7404 4.73054 16.424 4.95409 16.1276C5.20582 15.7939 5.50466 15.4951 6.10235 14.8974Z" stroke="#e6e600" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <div>
                        <button className="blank-button" onClick={e => changeMode(PollMode.DELETE)} title="Deletar enquete">
                            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="#b22222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

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
                    <RenderOptions pollId={poll._id} options={options} setOptions={setOptions} hasExpired={poll._status === PollStatus.EXPIRED} />
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