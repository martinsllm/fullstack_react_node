//Libs
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardText, ModalBody, ModalFooter, ModalHeader, Label, Input, Button } from "reactstrap";
import { FaCheck, FaEdit, FaRegFileAlt, FaTimes, FaTimesCircle, FaTrash } from "react-icons/fa";

//API
import API from '../../services/axios';

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header, {token} from "../../components/Header";
import Modal  from "../../components/Modal";

const Item = () => {
    //Data
    const [data, setData] = useState([]);
    const [dataArticle, setDataArticle] = useState([]);
    const [article, setArticle] = useState("");
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
        async function GetItem() {
            const response = await API.get(`item/${id}`)

            const { number, text, articleId } = response.data

            setData(response.data);
            setNumber(number);
            setText(text);
            setArticle(articleId)
        }
        
        async function GetAllArticles() {
            const response = await API.get(`article`)
            setDataArticle(response.data)
        }

        GetItem()
        GetAllArticles()
    },[id])

    async function Edit() {
        try {
            const formData = { number, text, articleId: article }
            await API.put(`item/${id}`, formData, headerConfig)
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
        }
        reload()
     }
 
    async function Remove() {
        try {
            await API.delete(`item/${id}`, headerConfig) 
        } catch (error) {
            setError(error.response.data.message)
            openCloseModal('error')
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
                <h3 className="my-4 text-center font-weight-light font-italic">Item nº {data.number}</h3>

                <Article>
                    <Card body>
                        <CardText className="lead"><b>{data.numberRoman}</b> . {data.text} </CardText>

                        <div className="mt-1 text-center">
                            <Button color="primary" onClick={() => openCloseModal("edit")}><FaEdit /> Editar</Button>{' '}
                            <Button color="danger" onClick={() => openCloseModal("remove")}><FaTrash/> Excluir</Button>
                        </div>
                    </Card>
                </Article>

            <Footer />

            {isOpen && action === 'edit' ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                   <ModalHeader>
                        <FaRegFileAlt size={20}/> Editar Inciso
                    </ModalHeader>     
                    <ModalBody>
                        <div className="form-group">
                            <Label className="col-sm-2 col-form-çabel">Número:</Label>
                            <Input min="1" type="number" defaultValue={data.number} onChange={(ev) => setNumber(ev.target.value)} />
                            <br />
                        
                            <Label className="col-sm-2 col-form-çabel">Texto:</Label>
                            <textarea className="form-control" defaultValue={data.text} onChange={(ev) => setText(ev.target.value)}></textarea>
                            <br />
        
                            <Input type="select" className="form-control" defaultValue={data.articleId} onChange={(ev) => setArticle(ev.target.value)}>
                                {dataArticle.map(article => (
                                   <option key={article.id} value={article.id}>{article.number} - {article.text}</option>
                                ))}
                           </Input>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={Edit}><FaCheck size={12}/> Confirmar</Button>
                        <Button color="danger" onClick={toggle}><FaTimes size={12}/> Cancelar</Button>
                    </ModalFooter>
                </Modal>
            ) : null}

            {isOpen && action === 'remove' ? (
                <Modal isOpen={isOpen} toggle={toggle}>
                   <ModalHeader>
                        <FaRegFileAlt size={20}/> Remover Inciso
                    </ModalHeader>     
                    <ModalBody>
                        Tem certeza que deseja remover esse item permanentemente?
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
};

export default Item;