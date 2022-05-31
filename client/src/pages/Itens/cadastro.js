//Libs
import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Card, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FaPlus, FaTimesCircle } from "react-icons/fa";

//API
import API from "../../services/axios";

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";

const NewItem = () => {
    //API Data
    const [number, setNumber] = useState("");
    const [text, setText] = useState("");

    const { id } = useParams();

    //Headers Config
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
    async function Add() {
        try {
            const formData = { number, text, articleId: id }
            await API.post("/item", formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message);
            openCloseModal();
        }
        reload()
    }

    function reload() {
        setTimeout(() => {
            window.location = `/article/${id}`;
        }, 1000)
    }

    return(
        <div>
            <Header />
                <Article>
                    <h3 className="my-4 text-center font-weight-light font-italic">Novo Item</h3>
                    <Card body>
                        <div className="form-group row">
                            <Label className="col-sm-2 col-form-label">Número:</Label>
                            <div className="col-sm-10">
                                <Input min="1" type="number" placeholder="Número" onChange={(ev) => setNumber(ev.target.value)} />
                            </div> 
                        </div>

                        <div className="form-group row">
                            <Label className="col-sm-2 col-form-label">Texto:</Label>
                            <div className="col-sm-10">
                                <textarea className="form-control" placeholder="Texto" onChange={(ev) => setText(ev.target.value)}></textarea>
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
                       {error}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={toggle}>Ok</Button>
                    </ModalFooter>
                </Modal>
            ) : null}   
        </div>
    )
}

export default NewItem;