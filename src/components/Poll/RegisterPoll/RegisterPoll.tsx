import { useState } from "react"
import APICall from "../../../utils/APICall";
import Option from "../../../model/Option";
import FeedBack from "../../../utils/Feedback";

import "./registerPoll.css";

export default function RegisterPoll() {
    const [options, setOptions] = useState<Option[]>([]);
    const [optionsMissing, setOptionsMissing] = useState<number>(3);

    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [option, setOption] = useState<string>("");

    function addOption() {
        const hasAlreadyBeenInclude = options.filter(optionToCompare => optionToCompare.content === option).length > 0;

        if (hasAlreadyBeenInclude) {
            FeedBack.error("Opção já incluida");
        } else if (option) {
            setOptions(options.concat({ id: 0, content: option, pollId: 0, voteCount: 0 }));
            if(optionsMissing > 0) setOptionsMissing(optionsMissing - 1);
            setOption("");
        } else {
            FeedBack.error("Conteudo não pode ficar vazio");
        }
    }

    function removeOption(option: Option) {
        setOptions(options.filter(optionToFilter => optionToFilter.content !== option.content));
        if(options.length <= 3) setOptionsMissing(optionsMissing + 1);
    }

    function savePool() {
        const removeBar = (date: string) => date.split("/" || "-").join("");

        const dateCheck = new RegExp("^(?:19|20)\\d\\d(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01])$");

        if(!dateCheck.test(removeBar(startDate))) {
            FeedBack.error("Data de inicio não informada ou formato invalido");
        } else if(!dateCheck.test(removeBar(endDate))) {
            FeedBack.error("Data de termino não informada ou formato invalido");
        } else {
            APICall.post(`/poll`, {title, startDate, endDate, options})
                .then(resp => {
                    setTitle("");
                    setStartDate("");
                    setEndDate("");
                    setOptions([]);
                    FeedBack.success("Enquete criada com sucesso");
                })
                .catch(err => FeedBack.error("Erro ao criar enquete"));
        }

    }

    function renderOptions() {
        if (options.length > 0) {
            return options.map(option => {
                return (
                    <div key={`option-${option.content}`} className="option-to-save">
                        <div>
                            <span>{option.content}</span>
                        </div>

                        <div className="delete-option">
                            <button type="button" title={`Remover opção ${options.length < 3 ? "(Você precisa de pelo menos 3)" : ""}`} onClick={e => removeOption(option)}>
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#f00" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#f00" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )
            })
        }
    }

    return (
        <form className="flex-column-center">
            <div className="input-group margin-y flex-column-center">
                <div>
                    <label htmlFor="title">Título</label>
                </div>

                <div className="input">
                    <input placeholder="Informe o título" value={title} onChange={e => setTitle(e.target.value)} type="text" id="title" name="title" />
                </div>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div>
                    <label htmlFor="start_date">Data de inicio</label>
                </div>

                <div className="input">
                    <input placeholder="Formato ANO/MÊS/DIA" value={startDate} onChange={e => setStartDate(e.target.value)} type="text" id="start_date" name="start_date" />
                </div>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div>
                    <label htmlFor="end_date">Data de termino</label>
                </div>

                <div className="input">
                    <input placeholder="Formato ANO/MÊS/DIA" value={endDate} onChange={e => setEndDate(e.target.value)}  type="text" id="end_date" name="end_date" />
                </div>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div className="input-group margin-y flex-column-center">
                    <div>
                        <label htmlFor="option">Opção</label>
                    </div>

                    <div className="input">
                        <input placeholder="Digite o conteudo da opção" onChange={e => setOption(e.target.value)} type="text" id="option" name="option" />
                    </div>
                </div>

                <div className="margin-y">
                    <button type="button" className="clean-button" onClick={() => addOption()}>Adionar opção {optionsMissing > 0 ? `Obrigatório mais ${optionsMissing})` : ""}</button>
                </div>

                <div className="margin-y">
                    {renderOptions()}
                </div>
            </div>

            {optionsMissing === 0 ? (
                <div className="save">
                    <button type="button" onClick={e => savePool()} className="clean-button">Salvar</button>
                </div>
            ) : false}
        </form>
    )
}