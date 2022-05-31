//Libs
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Card, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FaPlus, FaTimesCircle } from "react-icons/fa";
import { MultiSelect } from "react-multi-select-component";

//API
import API from "../../services/axios";

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";

const NewOccurrence = () => {
    //API Data
    const [text, setText] = useState("");
    const [sanction, setSanction] = useState("");
    const [article, setArticle] = useState([]);
    const [dataArticle, setDataArticle] = useState([]);

    const { id } = useParams();

    //Header Config
    const headerConfig = {     
        headers: { 'authorization': token }
    }

    //Modal Config
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [error, setError] = useState("");

    const openCloseModal = () => {
        setIsOpen(true);
    };

    //HTTP METHODS
    useEffect(() => {
        async function GetAllArticles() {
            const response = await API.get(`/article`)
            setDataArticle(response.data)
        }

        GetAllArticles()
    }, [])

    let options = []
    dataArticle.map(article => {
        return options.push(
            { value: article.id, label: article.text }
        )
    })

    async function Add() {
        try {
            let articleSelected = []

            article.map(art => {
                return articleSelected.push(art.value)
            })
            
            const formData = { text, sanction, articleId: articleSelected, studentId: id }
            await API.post("/occurrence", formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message);
            openCloseModal();
        }
        reload()
    }

    function reload() {
        setTimeout(() => {
            window.location.href = `/student/${id}`
        }, 1000)
    }

    return(
        <div>
            <Header />
                <Article>
                    <h3 className="my-4 text-center font-weight-light font-italic">Nova Ocorrência</h3>
                    <Card body>
                        <div className="form-group row">
                            <Label className="col-sm-2 col-form-label">Motivo:</Label>
                            <div className="col-sm-10">
                                <textarea className="form-control" placeholder="Motivo" onChange={(ev) => setText(ev.target.value)}></textarea>
                            </div> 
                        </div>

                        <div className="form-group row">
                            <Label className="col-sm-2 col-form-label">Sanção:</Label>
                            <div className="col-sm-10">
                                <Input placeholder="Sanção" onChange={(ev) => setSanction(ev.target.value)}></Input>
                            </div> 
                        </div>

                        <div className="form-group row">
                            <Label className="col-sm-2 col-form-label">Artigo:</Label>
                            <div className="col-sm-10">
                                <MultiSelect 
                                    value={article}
                                    options={options}
                                    onChange={setArticle}
                                    labelledBy="Select"
                                />
                            </div> 
                        </div>

                        <div className="my-3 text-center">
                            <Button color="success" onClick={Add}><FaPlus size={12}/> Adicionar</Button>
                        </div>
                    </Card>
                </Article>
            <Footer />

            {isOpen ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaTimesCircle size={18}/> Erro!
                    </ModalHeader>
                    <ModalBody>
                        Erro: {error}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={toggle}>Ok</Button>
                    </ModalFooter>
                </Modal>
            ) : null}   
        </div>
    )
}

export default NewOccurrence;