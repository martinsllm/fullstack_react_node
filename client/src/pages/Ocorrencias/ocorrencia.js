//Libs
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardText, Col, ModalHeader, ModalBody, ModalFooter, Label, Input, Row } from "reactstrap";
import { FaCheck, FaEdit, FaTimes, FaTimesCircle, FaTrash } from "react-icons/fa";
import moment from "moment";
import { MultiSelect } from "react-multi-select-component";

//API
import API from '../../services/axios';

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";
import Modal from "../../components/Modal";

const Occurrence = () => {
    //API Data
    const [data, setData] = useState([]);
    const [dataArticle, setDataArticle] = useState([]);
    const [text, setText] = useState("");
    const [sanction, setSanction] = useState("");
    const [article, setArticle] = useState([])
    const [student, setStudent] = useState("");

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
        async function GetOccurrence() {
            const response = await API.get(`/occurrence/${id}`)
            
            const { text, sanction, student, article } = response.data
            setData(response.data);
            setText(text)
            setSanction(sanction)
            setStudent(student)
            setArticle(article)
        }
        
       async function GetAllArticles() {
            const response = await API.get(`/article`)
            setDataArticle(response.data)
       }

        GetOccurrence()
        GetAllArticles()
    }, [id])

    let options = []
    dataArticle.map(article => {
        return options.push(
            { value: article.id, label: article.text }
        )
    })

    async function Edit() {
       try {
            let articleSelected = []

            article.map(art => {
                return articleSelected.push(art.value)
            })
            
            const formData = { text, sanction, articleId: articleSelected }
            await API.put(`/occurrence/${id}`, formData, headerConfig)
       } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
       }
       reload()
    };

    async function Remove() {
        try {
            await API.delete(`/occurrence/${id}`, headerConfig)
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal("error")
        }
        reload()
    }

    function reload() {
        setTimeout(() => {
            window.location.href = '/occurrence'
        }, 1000)
    }

    return (
        <div>
            <Header />
                <Article>
                    <h3 className="my-4 text-center font-weight-light font-italic">
                        Ocorrência nº {id} - {moment(data.createdAt).format('DD/MM/YYYY')}
                    </h3>
                    <Row className="my-3 text-center">
                        <Col>
                            <Card body>
                                <CardText className="lead"> Motivo: {data.text} </CardText>
                                <CardText className="lead"> Sanção: {data.sanction} </CardText>
                                <CardText className="lead"> Estudante: <a className="text-dark" href={`/student/${data.studentId}`}>{student.name}</a> </CardText>
                                <p className="lead" key={data.id}> Artigo(s) violado(s): 
                                    {article.map(article => (
                                        <a key={article.id} className="text-dark" href={`/article/${article.id}`}> {article.number}º ,</a>
                                    ))}
                                 </p> 
                                <div className="mt-1">
                                    <Button color="primary" onClick={() => openCloseModal("edit")}><FaEdit /> Editar</Button>{' '}
                                    <Button color="danger" onClick={() => openCloseModal("remove")}><FaTrash /> Excluir</Button>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Article>
            <Footer />

            {isOpen && action === "edit" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaEdit /> Editar Ocorrência
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <Label>Motivo: </Label>
                            <Input type="text" defaultValue={data.text} onChange={(ev) => setText(ev.target.value)}/>
                            <br />

                            <Label>Sanção: </Label>
                            <Input type="text" defaultValue={data.sanction} onChange={(ev) => setSanction(ev.target.value)}/>
                            <br />

                            <Label>Artigo: </Label>
                            <MultiSelect 
                                value={article}
                                options={options}
                                onChange={setArticle}
                                labelledBy="Select"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={Edit}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {isOpen && action === "remove" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaTimes /> Remover Ocorrência
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
                        Erro: {error}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={toggle}>Ok</Button>
                    </ModalFooter>
                </Modal>
            ) : null}   
        </div>
    );
}

export default Occurrence;