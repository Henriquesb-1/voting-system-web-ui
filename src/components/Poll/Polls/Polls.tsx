import { useEffect, useState } from "react";
import PollModel from "../../../model/Poll";
import APICall from "../../../utils/APICall";
import Paginator from "../../utils/Paginator";
import PollStatus from "../../../model/PollStatus";
import Error from "../../../components/utils/Error";

import Loading from "../../../components/utils/Loading";

import "./polls.css";

interface PollsProps {
    currentPage: string;
}

export default function Polls({ currentPage }: PollsProps) {
    const [polls, setPolls] = useState<PollModel[]>([]);
    const [pages, setPages] = useState<number>(1);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasOccurredAnError, setHasOccurredAnError] = useState<boolean>(false);

    useEffect(() => {
        APICall.get(`/poll?page=${currentPage}`)
            .then(resp => {
                const { data } = resp;
                setPolls(data.data);
                setPages(data.pages)
            })
            .catch(err => setHasOccurredAnError(true))
            .finally(() => setIsLoading(false));
    }, [])

    const goToPoll = (link: string) => window.location.replace(`/poll/${link}`);


    function renderPolls() {
        if (polls.length > 0) {
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
                                onClick={e => goToPoll(poll._title)}
                                disabled={poll._status === PollStatus.WILL_START}
                                title={poll._status === PollStatus.WILL_START ? `Irá ficar disponivel em ${poll._startDate}` : `Acessar enquete`}
                                className="clean-button"
                            >
                                Acessar enquete
                            </button>
                        </div>
                    </div>
                )
            })
        } else {
            return (
                <div className="flex-row-center">
                    <h3>
                        Nenhuma enquete criada. <br />
                        <a href="/register" className="clean-link" style={{color: "#000"}}>Criar uma</a>
                    </h3>
                </div>
            )
        }
    }

    return (
        <>
            <div className="polls margin-y">
                {!hasOccurredAnError ? (
                    <>{isLoading ? <Loading /> : <>{renderPolls()}</>}</>
                ) : <Error />}                
            </div>

            <Paginator currentPage={currentPage} pages={pages} pageURL="/" />
        </>
    )
}