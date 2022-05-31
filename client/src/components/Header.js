//Libs
import React, { useState } from "react";
import { ModalBody, ModalHeader, ModalFooter, Input, Button } from 'reactstrap';
import InputMask from "react-input-mask";
import { FaCheck, FaCheckCircle, FaHome, FaTimesCircle, FaUsersCog } from "react-icons/fa";

//Components
import Modal from "./Modal";

//Config
import API from '../services/axios';

const Header = () => {
    //Data
    const [student, setStudent] = useState([]);
    const [name, setName] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [email, setEmail] = useState("");
    const [whats, setWhats] = useState("");
    const [password, setPassword] = useState("");

    //Modal
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const [action, setAction] = useState("");
    const [error, setError] = useState("");

    const openCloseModal = (action) => {
        setIsOpen(true);

        switch(action){
            case 'cad': 
                setAction(action);
                break;
            case 'login' : 
                setAction('login');
                break;
            default: 
                setAction('error');
        }
    }

    async function Add() {
        try {
            const formData = { name, dataNascimento, email, whats, password }
            await API.post(`/user`, formData)
            reload()
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
    }

    const token = sessionStorage.getItem('@frontend/token')
    const id = sessionStorage.getItem('@frontend/id')

    async function Login() {
        try {
            const formData = { email, password }
            const response = await API.post(`/login`, formData)

            const user = await API.get(`/user/email/${email}`)

            sessionStorage.setItem('@frontend/id', user.data.id)
            sessionStorage.setItem('@frontend/token', response.data.token)

            setAction("success")

            reload()
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
    }

    function Logout() {
        sessionStorage.removeItem('@frontend/token')
        sessionStorage.removeItem('@frontend/id')
        window.location.href = '/class'
    }

    function reload() {
        setTimeout(() => {
            window.location.href = '/'
        }, 1000)
    }
    
    return(
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">

                <a class="navbar-brand" href="/"><FaHome /></a>

                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/class">Turmas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/occurrence">Ocorrências</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/article">Regulamento</a>
                    </li>

                    {!isOpen && !token ? (
                        <div className="nav-item dropdown">
                        <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" 
                        aria-haspopup="true" aria-expanded="false" style={{cursor: 'pointer'}}>
                            <FaUsersCog size={20} /> 
                        </div>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Button className="dropdown-item" onClick={() => openCloseModal("cad")}>Cadastre-se</Button>
                            <div className="dropdown-divider"></div>
                            <Button className="dropdown-item" onClick={() => openCloseModal("login")}>Entrar</Button>
                        </div>
                    </div>
                    ) : (
                        <div className="nav-item dropdown">
                        <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" 
                        aria-haspopup="true" aria-expanded="false" style={{cursor: 'pointer'}}>
                            <FaUsersCog size={20} /> 
                        </div>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <Button className="dropdown-item" onClick={() => Logout()}>Sair</Button>
                            <div className="dropdown-divider"></div>
                            <Button className="dropdown-item" href={`/user/${id}`}>Acessar perfil</Button>
                        </div>
                        </div>
                    )}
                    
                    </ul>

                    <form class="form-inline my-2 my-lg-0" action={`/student/result/${student}`}>
                        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={(ev ) => setStudent(ev.target.value)}/>
                        <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                    </form>

                </div>
            </nav>

            {(isOpen && action === "cad") ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        Cadastre-se Abaixo
                    </ModalHeader>

                    <ModalBody>
                        <Input type="text" placeholder="Nome Completo" onChange={(ev) => setName(ev.target.value)}/>
                        <br />

                        <Input type="email" placeholder="Email" onChange={(ev) => setEmail(ev.target.value)}/>
                        <br />

                        <InputMask mask="99/99/9999" className="form-control" placeholder="Data de Nascimento" onChange={(ev) => setDataNascimento(ev.target.value)}/>
                        <br />

                        <InputMask mask="(99)99999-9999" className="form-control" type="tel" placeholder="Telefone" onChange={(ev) => setWhats(ev.target.value)}/>
                        <br />

                        <Input type="password" placeholder="Senha" onChange={(ev) => setPassword(ev.target.value)}/>
                        <br />                    
                    </ModalBody>

                    <ModalFooter>
                        <Button color="success" onClick={Add}><FaCheck size={12}/> Confirmar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {(isOpen && action === "login") ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader>
                    Login
                </ModalHeader>

                <ModalBody>
                    <Input type="email" placeholder="E-mail" onChange={(ev) => setEmail(ev.target.value)}/>
                    <br />

                    <Input type="password" placeholder="Senha" onChange={(ev) => setPassword(ev.target.value)}/>
                    <br />
                    
                    <a href={`/verifyUser`}>Esqueceu a senha?</a> 
                </ModalBody>

                <ModalFooter>
                    <Button color="success" onClick={Login}><FaCheck size={12}/> Entrar</Button>
                </ModalFooter>
            </Modal>
            ) : null}

            {isOpen && action === "success" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaCheckCircle size={18}/> Sucesso!
                    </ModalHeader>
                    <ModalBody>
                        Usuário logado com sucesso!
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
                        {error}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={toggle}>Ok</Button>
                    </ModalFooter>
                </Modal>
            ) : null}   

        </div>
    );
}

const token = sessionStorage.getItem('@frontend/token');
export { token }

export default Header;