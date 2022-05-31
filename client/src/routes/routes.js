import React from "react";
import {Routes, Route} from 'react-router-dom';

import PrivateRoutes from "./privateRoutes";

//Main
import Main from "../pages";

//Turmas
import MainClass from "../pages/Turmas";
import Class from "../pages/Turmas/turma";

//Estudantes
import Student from "../pages/Estudantes";
import Search from "../pages/Estudantes/search";

//Ocorrencias
import MainOccurrence from "../pages/Ocorrencias";
import NewOccurrence from "../pages/Ocorrencias/cadastro";
import Occurrence from "../pages/Ocorrencias/ocorrencia";

//Artigos
import MainArticle from "../pages/Artigos";
import Artigo from "../pages/Artigos/artigo";

//Itens
import NewItem from "../pages/Itens/cadastro";
import Item from "../pages/Itens/item";

//User
import VerifyUser from "../pages/Usuarios/verifyUser";
import ResetPassword from "../pages/Usuarios/resetPassword";
import Perfil from "../pages/Usuarios/perfil";

const MainRoutes = () => {
    return(
        <div>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/verifyUser" element={<VerifyUser />} />
                <Route path="/resetPassword" element={<ResetPassword />} />
                <Route element={<PrivateRoutes/>}>
                    <Route path="/user/:id" element={<Perfil />} />
                    <Route path="/article" element={<MainArticle />}/>
                    <Route path="/article/:id" element={<Artigo />} />
                    <Route path="/class" element={<MainClass />} />
                    <Route path="/class/:id" element={<Class />} />
                    <Route path="student/:id" element={<Student />} />
                    <Route path="student/result/:id" element={<Search />} />
                    <Route path="/occurrence" element={<MainOccurrence />} />
                    <Route path="/occurrence/:id" element={<Occurrence />} />
                    <Route path="/occurrence/new/:id" element={<NewOccurrence />} />
                    <Route path="/item/new/:id" element={<NewItem />} />
                    <Route path="item/:id" element={<Item />} />
                </Route>
            </Routes>
        </div>
    )
}

export default MainRoutes;
