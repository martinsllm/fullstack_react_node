//Libs
import React, { useEffect, useState } from "react";
import { Button, Card, Input, Label, List, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { FaCheck, FaPlus, FaRegFileAlt, FaTimes, FaTimesCircle } from "react-icons/fa";

//API
import API from '../../services/axios';

//Components
import Article  from '../../components/Article';
import Footer from '../../components/Footer';
import Header, {token} from '../../components/Header';
import Modal from "../../components/Modal";
import Paginator from "../../services/pagination";

const Main = () => {
    //API Data
    const [data, setData] = useState([]);
    const [number, setNumber] = useState("");
    const [text, setText] = useState("");

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
            case 'cad' :
                setAction(action);
                break;
            default : 
                setAction('error')
        }
    };

    //Pagination Config
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL_POSTS_PAGE = 4;
    const LAST_POST_INDEX = currentPage * TOTAL_POSTS_PAGE
    const FIRST_POST_INDEX = LAST_POST_INDEX - TOTAL_POSTS_PAGE
    const CURRENT_POST_INDEX = data.slice(FIRST_POST_INDEX, LAST_POST_INDEX)

    //HTTP METHODS
    useEffect(() => {
        async function GetAllArticles() {
            const response = await API.get(`/article`)
            setData(response.data);  
        }     
        
        GetAllArticles()
    },[]);

    async function Add() {
        try {
            const formData = { number, text }
            await API.post(`/article`, formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message);
            openCloseModal('error')
        }
        reload()
    };

    function reload() {
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    return(
        <div>
            <Header />
                {data.length > 0 ? (
                    <Article>
                        <h3 className="my-4 text-center font-weight-light font-italic">Lista De Artigos</h3>
                        <Card body>
                            <List type="unstyled">
                                {CURRENT_POST_INDEX.map(article => (
                                    <ul key={article.number}>
                                        <a className="lead text-dark" href={`/article/${article.id}`}><b>Art. º{article.number}</b> - {article.text}</a>
                                    </ul>
                                ))}
                            </List>
                        </Card>
                        <Paginator postsPerPage={TOTAL_POSTS_PAGE} totalPosts={data.length} paginate={(page) => setCurrentPage(page)}/>
                    </Article>
                ) : (
                    <h3 className="my-4 text-center font-weight-light font-italic">
                        Ainda não há nenhum artigo registrado!
                    </h3>
                )}
                <div className="my-3 text-center">
                    <Button color="success" onClick={() => openCloseModal('cad')}><FaPlus size={12}/> Adicionar Novo</Button>
                </div>
            <Footer />

            {isOpen && action === "cad" ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                    <ModalHeader>
                        <FaRegFileAlt /> Novo Artigo
                    </ModalHeader>

                    <ModalBody>
                        <div className="form-group">
                            <Label>Número: </Label>
                            <Input type="number" min="1" placeholder="Número" onChange={(ev) => setNumber(ev.target.value)}/>
                            <br />

                            <Label>Texto: </Label>
                            <Input type="text" placeholder="Texto" onChange={(ev) => setText(ev.target.value)}/>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="success" onClick={Add}><FaCheck /> Confirmar</Button>{' '}
                        <Button color="danger" onClick={toggle}><FaTimes/> Cancelar</Button>
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

export default Main;