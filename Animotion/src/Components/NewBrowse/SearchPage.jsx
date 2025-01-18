import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import NavBar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ChatbotButton from "../Chatbot/ChatbotButton/ChatbotButton";
import TopRedirect from "../TopRedirectButton/TopRedirect";
import axios from "axios";
import BrowseCard from "../Browse/BrowseCard/BrowseCard";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import Preloader from "../Preloader/Preloader";
import GenresBtn from "../Browse/GenresPage/GenresBtn";
import "./SearchPage.css";

const SearchPage = () => {
    const [browse, setBrowse] = useState([]);
    const [genres, setGenres] = useState([]);
    const [page, setPage] = useState(1);
    const [genreState, setGenreState] = useState(true);

    const {searchId} = useParams();
    const handleGenre = () => {
        if (genreState == true){
            setGenreState(false);
        }
        else{
            setGenreState(true);
        }
    }

    const handleNextPage = () => {
        if(page>0){
            setPage(page+1);
        
        }
    }

    const handlePrevPage = () => {
        if(page>1){
            setPage(page-1);
        }
    }

    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/search?q="${searchId}"&page=${page}`)
        .then((res) => setBrowse(res.data.data.animes))
    },[searchId, page])
    
    useEffect(()=>{
        axios.get(`${import.meta.env.VITE_API}/api/v2/hianime/home`)
        .then((res) => setGenres(res.data.data.genres))
        window.scrollTo(0,0);
    },[])
    return(<>
        <div>
            <Preloader/>
            <NavBar/>
            <div className="browseContent">
                <div className="browsePageDivide">
                    <div className="container">
                        <div class="row">
                            <div>
                                <div className="BrowseAnimeContainer">
                                    <span className="browseAnimeTitle">Search results for : <span className="browseAnimeTitle2">{searchId}</span></span>
                                    <div className="alignBrowseAnime">
                                        {browse?browse.map((seasonal) => (
                                                <BrowseCard key={seasonal.id} id={seasonal.id} title={seasonal.name} coverImage={seasonal.poster}/>
                                            )):
                                            <span className="browseAnimeTitle2">No Results Found</span>
                                        }
                                    </div>
                                    <div className="pageBtnGrp">
                                        <button className="pageBtn" onClick={handlePrevPage}><KeyboardDoubleArrowLeftIcon/>Prev Page</button>
                                        <input class="quantity-input" type="text" value={page} disabled/>
                                        <button className="pageBtn" onClick={handleNextPage}>Next Page <KeyboardDoubleArrowRightIcon/></button>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                    <div className=" genreBtnBox">
                        <span className="browseTitle">Genres</span>
                        {genreState==true?
                        <div className="genreButtonGrp">
                            {genres.slice(0,21).map((genre) => (
                                <GenresBtn key={genre} id={genre} title={genre}/>
                            ))}
                        </div>:
                        <div className="genreButtonGrp">
                            {genres.map((genre) => (
                                <GenresBtn key={genre} id={genre} title={genre}/>
                            ))}
                        </div>}
                        <button className="genreDisplayBtn" onClick={handleGenre}>{genreState==true?"Show More":"Show Less"}</button>
                    </div>        
                </div>    
            </div>
            <Footer/>
            <ChatbotButton/>
            <TopRedirect/>
        </div>
    </>)
}

export default SearchPage;