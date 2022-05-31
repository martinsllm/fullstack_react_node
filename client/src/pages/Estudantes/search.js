//Libs
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, List } from "reactstrap";

//API
import API from "../../services/axios";

//Components
import Article from "../../components/Article";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Paginator from "../../services/pagination";


const Search = () => {
    //API Data
    const [data, setData] = useState([]);

    //Pagination Config
    const [currentPage, setCurrentPage] = useState(1);
    const TOTAL_POSTS_PAGE = 4;
    const LAST_POST_INDEX = currentPage * TOTAL_POSTS_PAGE
    const FIRST_POST_INDEX = LAST_POST_INDEX - TOTAL_POSTS_PAGE
    const CURRENT_POST_INDEX = data.slice(FIRST_POST_INDEX, LAST_POST_INDEX)

    const { id } = useParams();

    //HTTP METHODS
    useEffect(() => {
        async function GetStudents() {
            const response = await API.post(`/student/search/${id}`)
            setData(response.data)     
        }

        GetStudents()
    }, [id])

    return(
        <div>
            <Header />

            <Article>
            <h2 className="my-4 text-center font-weight-light font-italic">Resultados encontrados:</h2>
                {data.length > 0 ? (
                    <Card body>
                    <List type="unstyled">
                        <li>
                            <div>
                                {CURRENT_POST_INDEX.map(student => (
                                    <ul key={student.id}><a href={`/student/${student.id}`} className="lead text-dark">{student.registration}- {student.name}</a></ul>
                                ))}
                            </div>
                        </li>
                    </List>
                </Card>
                ) : null}
                <Paginator postsPerPage={TOTAL_POSTS_PAGE} totalPosts={data.length} paginate={(page) => setCurrentPage(page)}/> 
            </Article>

            <Footer />
        </div>
    )
}

export default Search;