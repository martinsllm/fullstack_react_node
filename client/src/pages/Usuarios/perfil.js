//Libs
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InputMask from "react-input-mask";
import { Button, Card, CardText, Col, Input, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { FaCheck, FaEdit, FaTimes, FaTimesCircle, FaTrash } from "react-icons/fa";

//API
import API from "../../services/axios"

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";
import Modal from "../../components/Modal";

const Perfil = () => {
    //API Data
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [whats, setWhats] = useState("");

    //Headers Config
    const headerConfig = {     
        headers: { 'authorization': token }
    }

    //Modal Config
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [action, setAction] = useState("");
    const [error, setError] = useState(""); 

    const openCloseModal = (action) => {
        setIsOpen(true);

        switch(action) {
            case 'remove' :
                setAction(action);
                break;
            case 'edit': 
                setAction(action);
                break;
            default : 
                setAction('error')
                break;
        }
    };

    //Url Params
    const { id } = useParams();

    //HTTP METHODS
    useEffect(() => {
        async function GetUser() {
            const response = await API.get(`/user/${id}`)
            const { name, email, whats, dataNascimento } = response.data

            setData(response.data)
            setName(name)
            setEmail(email)
            setWhats(whats)
            setDataNascimento(dataNascimento)
        }

        GetUser()
    },[id])

    async function Edit() {
        try {
            const formData = { name, email, whats, dataNascimento }
            await API.put(`user/${id}`, formData, headerConfig)
            reload()
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
    }

    async function Remove() {
        try {
            await API.delete(`/user/${id}`, headerConfig)
            reload()
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
    }

    function reload() {
        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }

    return(
        <div>
            <Header />
                <Article>
                    <h3 className="my-4 text-center font-weight-light font-italic">Perfil do Usuário</h3>
                    <Row className="my-3 text-center">
                        <Col>
                            <Card body>
                                <CardText className="lead"> Nome Completo: {data.name} </CardText>
                                <CardText className="lead"> Email: {data.email} </CardText>
                                <CardText className="lead"> Telefone: {data.whats} </CardText>
                                <CardText className="lead"> Data de Nascimento: {data.dataNascimento} </CardText>
                                
                                <div className="mt-1">
                                    <Button color="primary" onClick={() => openCloseModal("edit")}><FaEdit /> Editar</Button>{' '}
                                    <Button color="danger" onClick={() => openCloseModal("remove")}><FaTrash /> Excluir</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Article>
            <Footer />

            {(isOpen && action === "edit") ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        Editar usuário
                    </ModalHeader>

                    <ModalBody>
                        <Input type="text" defaultValue={data.name} onChange={(ev) => setName(ev.target.value)}/>
                        <br />

                        <Input type="email" defaultValue={data.email} onChange={(ev) => setEmail(ev.target.value)}/>
                        <br />

                        <InputMask mask="99/99/9999" className="form-control" defaultValue={data.dataNascimento} onChange={(ev) => setDataNascimento(ev.target.value)}/>
                        <br />

                        <InputMask mask="(99)99999-9999" className="form-control" type="tel" defaultValue={data.whats} onChange={(ev) => setWhats(ev.target.value)}/>
                        <br />               
                    </ModalBody>

                    <ModalFooter>
                        <Button color="success" onClick={Edit}><FaCheck size={12}/> Confirmar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {isOpen && action === "remove" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaTimes /> Remover Usuário
                    </ModalHeader>
                    <ModalBody>
                        Tem certeza que deseja excluir esse dado permanentemente?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={Remove}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="secondary" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {isOpen && action === "error" ? (
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

export default Perfil;