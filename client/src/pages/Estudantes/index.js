//Libs
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { FaCheck, FaEdit, FaRegFileAlt, FaTimes, FaTimesCircle, FaTrash, FaUserTimes } from 'react-icons/fa';
import { Button, Card, CardText, CardTitle, Col, ModalHeader, ModalBody, ModalFooter, Row, Label, Input} from 'reactstrap';
import InputMask from "react-input-mask";

//API
import API from "../../services/axios";

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";
import Modal  from "../../components/Modal";

import generatePDF from "../../reports/StudentReport";

const Student = () => {
     //API Data
     const [data, setData] = useState([]);
     const [dataClass, setDataClass] = useState([]);
     const [occurrence, setOccurrence] = useState([]);
     const [name, setName] = useState("");
     const [dataNascimento, setDataNascimento] = useState("");
     const [registration, setRegistration] = useState("");
     const [turma, setTurma] = useState("");
     const [file, setFile] = useState([]);
     const [newFile, setNewFile] = useState(null);

     //Headers Config
     const headerConfig = {     
        headers: { 'authorization': token }
     }

     //Modal
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
        async function GetStudent() {
            const response = await API.get(`/student/${id}`)
    
            const { name, registration, dataNascimento, classId, photo, occurrence } = response.data;
    
            setData(response.data)
            setName(name)
            setRegistration(registration)
            setDataNascimento(dataNascimento)
            setTurma(classId)
            setFile(photo[0])
            setOccurrence(occurrence)
        }

        async function GetAllClasses() {
            const response = await API.get(`/class`)
            setDataClass(response.data)
        }

        GetStudent()
        GetAllClasses()
    },[id])
    
    async function EditStudent() {
        try {
            const formData = { name, registration, dataNascimento, classId: turma }
            
            await API.put(`/student/${id}`, formData, headerConfig)

            if(newFile !== null) EditPhoto();   
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
        reload()
    }

    async function EditPhoto() {
        try {
            const formData = new FormData();

            formData.append('photo', newFile);

            const headerConfig = {     
                headers: { 
                    'content-type': 'multipart/form-data',
                    'authorization': token
                }
            }

            await API.put(`/upload/${file.id}`, formData, headerConfig)
                
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
        reload()
    }

    async function RemoveStudent() {
        try {
            await API.delete(`/student/${id}`, headerConfig)
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
                <h3 className="my-4 text-center font-weight-light font-italic">Perfil do Estudante</h3>
                    <Row className="my-3">
                        <Col>
                            <Card body className="text-center">
                                {file !== null ? (
                                    <div className="text-center">
                                        <img alt="Logo" src={file.url} width="120" height="120"/>
                                    </div>
                                ) : null}
                                <CardTitle tag="h5" className="mt-2">{data.name}</CardTitle>
                                <CardText>Matrícula: {data.registration}</CardText>
                                <CardText>Data de Nascimento: {data.dataNascimento}</CardText>
                                <CardText>
                                    <a href={`/occurrence/new/${data.id}`} className="btn text-dark"><FaEdit /> Inserir Ocorrência</a>
                                    <li onClick={() => generatePDF(occurrence, data)} className="btn text-dark"><FaRegFileAlt /> Gerar Relatório</li>
                                </CardText>
                                <div className="mt-1">
                                    <Button color="primary" onClick={() => openCloseModal("edit")}><FaEdit /> Editar</Button>{' '}
                                    <Button color="danger" onClick={() => openCloseModal("remove")}><FaTrash /> Excluir</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Article>
            <Footer />

            {isOpen && action === 'edit' ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaEdit size={20}/> Editar Estudante
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <Label>Nome Completo: </Label>
                            <Input type="text" defaultValue={data.name} onChange={(ev) => setName(ev.target.value)}/>
                            <br />

                            <Label>Matrícula: </Label>
                            <Input type="text" defaultValue={data.registration} onChange={(ev) => setRegistration(ev.target.value)}/>
                            <br />

                            <Label>Data de Nascimento: </Label>
                            <InputMask mask="99/99/9999" className="form-control" defaultValue={data.dataNascimento} onChange={(ev) => setDataNascimento(ev.target.value)}/>
                            <br />

                            <Label>Turma: </Label>
                            <Input type="select" className="form-control" defaultValue={turma.name} onChange={(ev) => setTurma(ev.target.value)}>
                                <option selected>Selecione uma turma</option>
                                {dataClass.map(turma => (
                                   <option key={turma.id} value={turma.id}>{turma.name}</option>
                                ))}
                            </Input>
                            <br/> 

                            <Label>Foto: </Label>
                            <Input type="file" accept=".jpg, .png, .jpeg" className="form-control" onChange={(ev) => setNewFile(ev.target.files[0])}/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={EditStudent}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {isOpen && action === "remove" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaUserTimes size={20}/> Remover Estudante
                    </ModalHeader>
                    <ModalBody className="text-justify">
                        Tem certeza que deseja excluir esse estudante permanentemente?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={RemoveStudent}><FaCheck size={12}/> Confirmar</Button>
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
    );
}

export default Student;