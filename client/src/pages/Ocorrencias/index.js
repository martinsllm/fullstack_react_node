//Libs
import React, { useState, useEffect} from "react";
import { Button, Card, List} from "reactstrap";
import { FaRegFileAlt } from "react-icons/fa";
import moment from "moment";

//API
import API from "../../services/axios";

//Components
import Article  from '../../components/Article';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Paginator from "../../services/pagination";

import generatePDF from "../../reports/MainReport";

const Main = () => {
    //API Data
    const [data, setData] = useState([]);

    //Pagination Config
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL_POSTS_PAGE = 4;
    const LAST_POST_INDEX = currentPage * TOTAL_POSTS_PAGE
    const FIRST_POST_INDEX = LAST_POST_INDEX - TOTAL_POSTS_PAGE
    const CURRENT_POST_INDEX = data.slice(FIRST_POST_INDEX, LAST_POST_INDEX)

    //HTTP METHODS
    useEffect(() => {
        async function GetAllOccurrences() {
            const response = await API.get("/occurrence")
            setData(response.data);
        } 

        GetAllOccurrences()
    }, []);

    return(
        <div>
            <Header />
                {CURRENT_POST_INDEX.length > 0 ? (
                    <Article>
                        <h3 className="my-4 text-center font-weight-light font-italic">Lista De Ocorrências</h3>
                        <Card body>
                            <List type="unstyled">
                                {CURRENT_POST_INDEX.map(occurrence => (
                                    <ul key={occurrence.id}><a href={`/occurrence/${occurrence.id}`} className="lead text-dark">Ocorrência nº {occurrence.id} - {moment(occurrence.createdAt).format("DD/MM/YYYY")}</a></ul>
                                ))}
                                <div className="text-center mt-3">
                                    <Button color="danger" onClick={() => generatePDF(data)}><FaRegFileAlt />Gerar PDF</Button>
                                </div>
                            </List>
                        </Card>
                        <Paginator postsPerPage={TOTAL_POSTS_PAGE} totalPosts={data.length} paginate={(page) => setCurrentPage(page)}/>
                    </Article>  
                ) : (
                    <h3 className="my-4 text-center font-weight-light font-italic">
                        Ainda não há nenhuma ocorrência registrada!
                    </h3>
                )}
            <Footer />
        </div>
    )
}

export default Main;