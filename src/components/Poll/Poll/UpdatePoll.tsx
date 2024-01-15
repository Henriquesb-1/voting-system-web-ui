import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Option from "../../../model/Option";
import Poll from "../../../model/Poll";
import FeedBack from "../../../utils/Feedback";
import APICall from "../../../utils/APICall";
import PollMode from "../../../model/PollMode";

interface UpdateOrDeletePollProps {
    poll: Poll;
    setPollMode: Dispatch<SetStateAction<PollMode>>;
}

export default function UpdatePoll({ poll, setPollMode }: UpdateOrDeletePollProps) {
    const [id, setId] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [option, setOption] = useState<string>("");

    const [options, setOptions] = useState<Option[]>([]);
    const [optionsMissing, setOptionsMissing] = useState<number>(0);
    const [optionsToDelete, setOptionToDelete] = useState<Option>();

    const [optionsToAdd, setOptionsToAdd] = useState<Option[]>([]);

    useEffect(() => {
        function revertDate(date: string) {
            const monthNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const monthName = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

            const dateSplited = date.split("de");
            const monthInNumber = monthNumber[monthName.indexOf(`${dateSplited[1].trim()}`)];
            return `${dateSplited[2]}-${monthInNumber}-${dateSplited[0]}`;
        }


        setId(poll._id);
        setTitle(poll._title);
        setStartDate(revertDate(poll._startDate));
        setEndDate(revertDate(poll._endDate));
        setOptions(poll._options);
    }, [])

    function addOption() {
        const hasAlreadyBeenInclude = options.filter(optionToCompare => optionToCompare.content === option).length > 0 || optionsToAdd.filter(optionToCompare => optionToCompare.content === option).length > 0;

        if (hasAlreadyBeenInclude) {
            FeedBack.error("Opção já incluida");
        } else if (option) {
            setOptionsToAdd(optionsToAdd.concat({ id: 0, content: option, pollId: poll._id, voteCount: 0 }));

            if (optionsMissing > 0) setOptionsMissing(optionsMissing - 1);

            setOption("");
        } else {
            FeedBack.error("Conteudo não pode ficar vazio");
        }
    }

    function deleteOption() {
        APICall.delete(`/options/${optionsToDelete?.id}/${poll._id}`)
            .then(resp => {
                FeedBack.success("Opção excluida");
                setOptions(options.filter(option => option.id !== optionsToDelete?.id))
                setOptionToDelete(undefined);
            })
            .catch(err => FeedBack.error("Erro ao excluir opção"));
    }

    function removeOptionToAdd(option: Option) {
        setOptionsToAdd(optionsToAdd.filter(optionAdded => optionAdded.content !== option.content));
    }

    function saveNewOptions() {
        try {
            optionsToAdd.forEach(option => {
                APICall.post(`/options`, { content: option.content, poll: { id: option.pollId } })
                    .then(resp => {
                        setOptions(options.concat(resp.data));
                        setOptionsToAdd([]);
                        FeedBack.success("Opções foram salvas");
                    });
            })

        } catch (error) {
            FeedBack.error("Erro ao salvar opções");
        }
    }

    function savePool() {
        const removeBar = (date: string) => date.split("/" || "-").join("");

        APICall.put("/poll", { id, title, startDate: removeBar(startDate), endDate: removeBar(endDate) })
            .then(resp => FeedBack.success("Alterações salvas"))
            .catch(err => FeedBack.error(err.response.data || "Erro ao editar enquete"));
    }

    function renderRegisteredOptions() {
        if (options.length > 0) {
            return options.map(option => {
                return (
                    <div key={`option-${option.content}`} className="option-to-save">
                        <div>
                            <span>{option.content}</span>
                        </div>

                        <div className="delete-option">
                            <button type="button" title={`Excluir ${options.length < 3 ? "(Você precisa de pelo menos 3)" : ""}`} onClick={e => setOptionToDelete(option)}>
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

    function renderOptionsToBeAdd() {
        if (optionsToAdd.length > 0) {
            return optionsToAdd.map(option => {
                return (
                    <div key={`option-${option.content}`} className="option-to-save">
                        <div>
                            <span>{option.content}</span>
                        </div>

                        <div className="delete-option">
                            <button type="button" title="Remover opção" onClick={e => removeOptionToAdd(option)}>
                                <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#f00" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#f00" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )
            })
        } else {
            return <span>Nenhuma nova opção adicionada</span>
        }
    }

    return (
        <form className="flex-column-center">
            <div className="back-button" style={{alignSelf: "flex-start"}}>
                <button type="button" onClick={e => setPollMode(PollMode.RENDER)} className="blank-button">Voltar para tela anterior</button>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div>
                    <label htmlFor="title">Título</label>
                </div>

                <div className="input flex-row-center">
                    <input placeholder="Informe o título" value={title} onChange={e => setTitle(e.target.value)} type="text" id="title" name="title" />
                </div>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div>
                    <label htmlFor="start_date">Data de inicio</label>
                </div>

                <div className="input flex-row-center">
                    <input placeholder="Formato ANO/MÊS/DIA" value={startDate} onChange={e => setStartDate(e.target.value)} type="text" id="start_date" name="start_date" />
                </div>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div>
                    <label htmlFor="end_date">Data de termino</label>
                </div>

                <div className="input flex-row-center">
                    <input placeholder="Formato ANO/MÊS/DIA" value={endDate} onChange={e => setEndDate(e.target.value)} type="text" id="end_date" name="end_date" />
                </div>
            </div>

            <div className="input-group margin-y flex-column-center">
                <div className="input-group margin-y flex-column-center">
                    <div>
                        <label htmlFor="option">Opção</label>
                    </div>

                    <div className="input flex-row-center">
                        <input placeholder="Digite o conteudo da opção" onChange={e => setOption(e.target.value)} type="text" id="option" name="option" />
                    </div>
                </div>

                <div className="margin-y">
                    <button type="button" className="clean-button" onClick={() => addOption()}>Adionar opção {optionsMissing > 0 ? `(Obrigatório mais ${optionsMissing})` : ""}</button>
                </div>

                <div className="margin-y">
                    <div className="flex-row-center">
                        <h3>Opções já adicionadas:</h3>
                    </div>

                    <div>
                        {renderRegisteredOptions()}
                    </div>
                </div>

                <div className="margin-y">
                    <div>
                        <h3>Opções a serem adicionadas:</h3>
                    </div>

                    <div>
                        {renderOptionsToBeAdd()}
                    </div>
                </div>
            </div>

            {optionsToAdd.length > 0 ? (
                <button type="button" className="clean-button" onClick={e => saveNewOptions()}>Salvar novas opções</button>
            ) : false}

            {optionsToDelete ? (
                <div className="save flex-row-center">
                    <div className="margin-x">
                        <button
                            disabled={options.length <= 3} title={options.length > 3 ? `Excluir opção ${optionsToDelete.content}` : "Crie mais uma antes de excluir"}
                            type="button" onClick={e => deleteOption()} className="clean-button"
                        >
                            {options.length > 3 ? `Excluir opção ${optionsToDelete.content} ?` : "Crie mais uma antes de excluir"}
                        </button>
                    </div>

                    <div>
                        <button type="button" className="cancel-button" onClick={e => setOptionToDelete(undefined)}>Cancelar</button>
                    </div>
                </div>
            ) : false}

            {optionsMissing === 0 ? (
                <div className="save margin-y">
                    <button type="button" onClick={e => savePool()} className="clean-button">Salvar Enquete</button>
                </div>
            ) : false}
        </form>
    )
}