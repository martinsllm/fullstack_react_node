//Libs
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardText, Input, Label, List, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FaCheck, FaEdit, FaPlus, FaTimes, FaTimesCircle, FaTrash } from "react-icons/fa";

//API
import API from '../../services/axios';

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";
import Modal from "../../components/Modal";
import Paginator from "../../services/pagination";

const Artigo = () => {
    //API Data
    const [number, setNumber] = useState("");
    const [text, setText] = useState("");;
    const [item, setItem] = useState([]);
    const [article, setArticle] = useState([]);
    
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

    //Pagination Config
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL_POSTS_PAGE = 3;
    const LAST_POST_INDEX = currentPage * TOTAL_POSTS_PAGE
    const FIRST_POST_INDEX = LAST_POST_INDEX - TOTAL_POSTS_PAGE
    const CURRENT_POST_INDEX = item.slice(FIRST_POST_INDEX, LAST_POST_INDEX)

    //Url Params
    const { id } = useParams();
    
    //HTTP METHODS 
    useEffect(() => {
        async function GetArticle() {
            const response = await API.get(`/article/${id}`)

            const { number, text, item } = response.data
            
            setArticle(response.data);
            setNumber(number);
            setText(text);
            setItem(item)
        }

        GetArticle()
    }, [id])

    async function Edit() {
        try {
            const formData = { number, text }
            await API.put(`/article/${id}`, formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message);
            openCloseModal('error');
        }
        reload()
    };

    async function Remove() {
        try {
            await API.delete(`/article/${id}`, headerConfig)
        } catch (error) {
            setError(error.response.data.message);
            openCloseModal('error');
        }
        reload()
    }

    function reload() {
        setTimeout(() => {
            window.location.href = '/article'
        }, 1000)
    }
    
    return(
        <div>
            <Header />
                <h3 className="my-4 text-center font-weight-light font-italic">Artigo nº {number}</h3>
                    <Article>
                        <Card body key={id}>
                            <CardText className="lead">
                                <b>Art. º{article.number} </b> - {article.text}
                            </CardText>

                            <List type="unistyled">
                                {CURRENT_POST_INDEX.map(item => (
                                    <ul key={item.id}>
                                        <a href={`/item/${item.id}`} className="text-dark">
                                            <b>{item.numberRoman}</b> . {item.text}
                                        </a>
                                    </ul> 
                                ))}      
                            </List>
                            <CardText className="text-center">
                                <a href={`/item/new/${id}`} className="btn text-dark"><FaPlus size={12}/> Inserir Novo Item</a>
                            </CardText>
                            <div className="mt-1 text-center">
                                <Button color="primary" onClick={() => openCloseModal("edit")}><FaEdit /> Editar</Button>{' '}
                                <Button color="danger" onClick={() => openCloseModal("remove")}><FaTrash/> Excluir</Button>
                            </div>
                        </Card>
                        <Paginator postsPerPage={TOTAL_POSTS_PAGE} totalPosts={item.length} paginate={(page) => setCurrentPage(page)}/>
                    </Article>
            <Footer/>

            {isOpen && action === "edit" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaEdit /> Editar Artigo
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <Label>Número: </Label>
                            <Input type="number" min="1" defaultValue={article.number} onChange={(ev) => setNumber(ev.target.value)}/>
                            <br />

                            <Label>Texto: </Label>
                            <Input type="text" defaultValue={article.text} onChange={(ev) => setText(ev.target.value)}/>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="success" onClick={Edit}><FaCheck size={12}/> Editar</Button>{' '}
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Excluir</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {isOpen && action === "remove" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaTimes /> Remover Artigo
                    </ModalHeader>

                    <ModalBody>
                        Deseja mesmo excluir esse dado permanentemente?
                    </ModalBody>

                    <ModalFooter>
                        <Button color="danger" onClick={Remove}><FaCheck size={12}/> Remover</Button>{' '}
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

export default Artigo;