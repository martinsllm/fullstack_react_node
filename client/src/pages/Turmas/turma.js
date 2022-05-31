//Libs
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { FaCheck, FaCog, FaPlus, FaTimes, FaTimesCircle, FaUser, FaUserFriends } from 'react-icons/fa';
import { Button, Card, Input, Label, List, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import InputMask from "react-input-mask";

//API
import API from "../../services/axios";

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";
import Modal from "../../components/Modal";
import Paginator from "../../services/pagination";

const Class = () => {
    //API Data
    const [data, setData] = useState([]);
    const [dataStudents, setDataStudents] = useState([]);
    const [dataNascimento, setDataNascimento] = useState("");
    const [name, setName] = useState("");
    const [newNameClass, setNewNameClass] = useState("");
    const [registration, setRegistration] = useState("");
    const [file, setFile] = useState("");

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
            case 'edit': 
                setAction(action);
                break;
            case 'remove':
                setAction(action);
                break;
            default : 
                setAction('error')
                break;
        }
    };

    //Pagination Config
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL_POSTS_PAGE = 4;
    const LAST_POST_INDEX = currentPage * TOTAL_POSTS_PAGE
    const FIRST_POST_INDEX = LAST_POST_INDEX - TOTAL_POSTS_PAGE
    const CURRENT_POST_INDEX = dataStudents.slice(FIRST_POST_INDEX, LAST_POST_INDEX)

    //Url params
    const { id } = useParams();

    //HTTP METHODS
    useEffect(() => {
        async function GetClass() {
            const response = await API.get(`/class/${id}`)

            const { students, name } = response.data
            
            setData(response.data);
            setDataStudents(students)
            setNewNameClass(name)
        }

        GetClass()
    },[id])

    async function AddStudent() {
        const formData = { name, registration, dataNascimento, classId: data.id }

        try {
            const response = await API.post("/student", formData , headerConfig)
            AddPhoto(response.data.id); 
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
    };

    async function AddPhoto(id) {
        const formData = new FormData();

        formData.append('photo', file);

        const headerConfig = {     
            headers: { 
                'content-type': 'multipart/form-data',
                'authorization': token 
            }
        }

        try {
            await API.post("/upload/" + id, formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
        reload()
    }

    async function UpdateClass() {
        const formData = {
            name: newNameClass
        }

        try {
            await API.put(`/class/${id}`, formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
        reload()
    }

    async function RemoveClass() {
        try {
            await API.delete(`/class/${id}`, headerConfig)
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
                <div className="nav-item dropdown">
                    <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" 
                    aria-haspopup="true" aria-expanded="false" style={{cursor: 'pointer'}}>
                        <FaCog />
                    </div>
                    <div className="dropdown-menu">
                        <Button className="dropdown-item" onClick={() => openCloseModal("edit")}>Editar turma</Button>
                        <div className="dropdown-divider"></div>
                        <Button className="dropdown-item" onClick={() => openCloseModal("remove")}>Excluir turma</Button>
                    </div>
                </div>

                <Article key={data.id}>
                    <h2 className="my-4 text-center font-weight-light font-italic">Lista De Alunos - {data.name} </h2>
                        {(dataStudents.length > 0) ? (
                            <Card body>
                                <List type="unstyled">
                                    <li>
                                        <div>
                                            {CURRENT_POST_INDEX.map(student => (
                                                <ul key={student.id}><a href={`/student/${student.id}`} className="lead text-dark">{student.registration} - {student.name}</a></ul>
                                            ))}
                                        </div>
                                    </li>
                                </List>
                            </Card> ) : (
                                <div>
                                    <h3 className="my-4 text-center font-weight-light font-italic">
                                        Ainda não há alunos matriculados!
                                    </h3>
                                </div>
                            )}              
                    <Paginator postsPerPage={TOTAL_POSTS_PAGE} totalPosts={dataStudents.length} paginate={(page) => setCurrentPage(page)}/>  
                    <div className="my-3 text-center">
                        <Button color="success" onClick={() => openCloseModal('cad')}><FaPlus size={12}/> Adicionar Novo</Button>
                    </div>
                </Article>
            <Footer />


            {isOpen && action === 'cad' ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaUser size={20}/> Novo Estudante
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <Label>Nome Completo: </Label>
                            <Input type="text" placeholder="Nome Completo" onChange={(ev) => setName(ev.target.value)}/>
                            <br />

                            <Label>Matrícula: </Label>
                            <Input type="text" placeholder="Matrícula" onChange={(ev) => setRegistration(ev.target.value)}/>
                            <br />

                            <Label>Data de Nascimento: </Label>
                            <InputMask mask="99/99/9999" className="form-control" placeholder="Data de Nascimento" onChange={(ev) => setDataNascimento(ev.target.value)}/>
                            <br />

                            <Label>Foto: </Label>
                            <Input type="file" accept=".jpg, .png, .jpeg" className="form-control" name="photo" placeholder="Foto" onChange={(ev) => setFile(ev.target.files[0])}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={AddStudent}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {(isOpen && action === 'remove') ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaUserFriends size={20}/> Excluir Turma
                    </ModalHeader> 
                        <ModalBody className="text-justify">
                            Tem certeza que deseja excluir esse dado permanentemente?
                        </ModalBody>    
                    <ModalFooter>
                        <Button color="danger" onClick={RemoveClass}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="secondary" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>                  
                </Modal>
            ) : null}

            {(isOpen && action === 'edit') ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaUserFriends size={20}/> Editar Turma
                    </ModalHeader> 
                        <ModalBody>
                            <div className="form-group">
                                <Label>Nome: </Label>
                                <Input type="text" defaultValue={data.name} onChange={(ev) => setNewNameClass(ev.target.value)}/>
                            </div>
                        </ModalBody>    
                    <ModalFooter>
                        <Button color="success" onClick={UpdateClass}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
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

export default Class;