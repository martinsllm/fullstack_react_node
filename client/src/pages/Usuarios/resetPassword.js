//Libs
import React, { useState } from "react";
import { FaCheck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Button, Input, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

//API
import API from "../../services/axios"

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Modal from "../../components/Modal";

const ResetPassword = () => {
    //API Data
    const [authorization, setAuthorization] = useState("");
    const [password, setPassword] = useState("")

    //Modal Config
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [action, setAction] = useState("");
    const [error, setError] = useState("");

    const openCloseModal = (action) => {
        setIsOpen(true);

        switch(action) {
            case 'success' :
                setAction(action);
                break;
            default : 
                setAction('error')
                break;
        }
    };

    //HTTP METHODS
    async function Update() {
        try {
            const formData = { authorization, password }
            
            await API.post(`/change-password`, formData)

            setAction("success")    
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
        reload()
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
                    <div className="row mt-5">
                        <div className="col"></div>
                        <div className="col-ls">
                            <Input type="text" placeholder="Token" onChange={(ev) => setAuthorization(ev.target.value)}/>
                            <br />
                            <Input type="password" placeholder="Nova senha" onChange={(ev) => setPassword(ev.target.value)} />
                            <br />
                            <Button color="success" onClick={Update}><FaCheck size={12} /> Confirmar</Button>
                        </div>
                        <div className="col"></div>
                    </div>  
                </Article>
            <Footer />

            {isOpen && action === "success" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaCheckCircle size={18}/> Sucesso!
                    </ModalHeader>
                    <ModalBody>
                        Senha resetada com sucesso!
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={toggle}>Ok</Button>
                    </ModalFooter>
                </Modal>
            ) : null}   

            {isOpen && action === "error" ? (
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

export default ResetPassword;