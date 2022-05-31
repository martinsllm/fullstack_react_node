//Libs
import React, { useEffect, useState } from "react";
import { FaCheck, FaPlus, FaSearch, FaTimes, FaTimesCircle, FaUserFriends} from 'react-icons/fa';
import { Button, Input, Label, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

//API
import API from '../../services/axios';

//Components
import Article  from '../../components/Article';
import Footer from '../../components/Footer';
import Header, {token} from '../../components/Header';
import Modal from '../../components/Modal';

const Main = () => {
    //API Data
    const [data, setData] = useState([]);
    const [name, setName] = useState("");
    const [selectValue, setSelectValue] = useState(""); 

    //Header Config
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
            case 'cad' :
                setAction(action);
                break;
            default : 
                setAction('error')
        }
    };
    
    //HTTP METHODS
    useEffect(() => {
        async function GetClasses() {
            const response = await API.get("/class")
            setData(response.data);
        }

        GetClasses()
    },[]);

    async function Add() {
        try {
            const formData = { name }
            await API.post("/class", formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
        reload()
    }

    function reload() {
        setTimeout(() => {
            window.location.href = '/class'
        }, 1000)
    }
    
    return(
        <div>
            <Header />
                <Article>
                    <div className="row mt-5">
                        <div className="col"></div>
                        <div className="col-ls">
                            <Input type="select" className="form-control" onChange={ev => setSelectValue(ev.target.value)}>
                                <option selected>Selecione uma turma</option>
                                {data.map((result, index) => (
                                    <option key={index} value={result.id}>Turma - {result.name}</option>
                                ))}
                            </Input>
                        </div>
                        <div className="col"></div>
                    </div>          
                </Article>

                <div className="mt-5 text-center">
                    <a className="btn btn-primary" href={`/class/${selectValue}`}><FaSearch size={12}/> Pesquisar</a>{' '}
                    <Button color="success" onClick={() => openCloseModal('cad')}><FaPlus size={12}/> Adicionar</Button>
                </div>
            <Footer />

            {(isOpen && action === 'cad') ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaUserFriends size={20}/> Nova Turma
                    </ModalHeader>
                        <ModalBody>
                            <div className="form-group">
                                <Label>Nome: </Label>
                                <Input type="text" placeholder="Nome" onChange={(ev) => setName(ev.target.value)}/>
                            </div>
                        </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={Add}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>                
                </Modal>
            ) : null}

            {(isOpen && action === 'error') ? (
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

export default Main;