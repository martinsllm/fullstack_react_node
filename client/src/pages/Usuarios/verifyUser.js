//Libs
import React, { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button, Form, Input, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

//API
import API from "../../services/axios"

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Modal from "../../components/Modal";

const VerifyUser = () => {
    //API Data
    const [email, setEmail] = useState("")

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
    async function SendEmail() {
        try {
            const formData = { email }
            
            await API.post(`/send-email`, formData)

            openCloseModal("success")
            reload()
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
    }

    function reload() {
        setTimeout(() => {
            window.location.href=`/resetPassword`
        }, 1000)
    }

    return(
        <div>
            <Header />
                <Article>
                        <div className="row mt-5">
                            <div className="col"></div>
                            <div className="col-ls">
                                <Form className="form-inline">
                                    <Input className="mr-sm-2" type="search" placeholder="Informe seu e-mail" aria-label="Search" onChange={(ev) => {setEmail(ev.target.value)}}/>
                                    <Button color="success" onClick={SendEmail}>Gerar token</Button>
                                </Form>
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
                        Token enviado ao seu e-mail com sucesso!
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

export default VerifyUser;