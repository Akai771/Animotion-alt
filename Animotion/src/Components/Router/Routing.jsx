import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Signin from "../Signing/Signin";
import Signup from "../Signing/Signup";
import Welcome from "../WelcomePage/welcome";
import Home from "../Home/Home";
import Chatbot from "../Chatbot/Chatbot";
import NewsBoard from "../News/NewsBoard";
import Schedule from "../Schedule/Schedule";
import Dmca from "../Footer/FooterPages/DMCA";
import Contact from "../Footer/FooterPages/Contact";
import Terms from "../Footer/FooterPages/Terms";
import Error from "../ErrorPage/Error";
import VideoInfo from "../Video/VideoInfo/VideoInfo";
import VideoMain from "../Video/VideoMain/VideoMain";
import ForgotPass from "../Signing/ForgotPassword/forgotPass";
import ResetPass from "../Signing/ForgotPassword/resetPass";
import Profile from "../Profile/profile";
import MangaInfo from "../Merch/MangaInfo/MangaInfo";
import MangaRead from "../Merch/MangaRead/MangaRead";
import Manga from "../Merch/manga";
import Watchlist from "../Watchlist/watchlist";
import GenresPage from "../Browse/GenresPage/GenresPage";
import History from "../History/history";
import RecentEpisodes from "../Home/RecentEpisodes/recentEpisodes";
import SearchPage from "../NewBrowse/SearchPage";


const Routing = () => {
  const [token, setToken] = useState(false);

  if(token){
    localStorage.setItem("token", JSON.stringify(token));
  }

  useEffect(() => {
    if(localStorage.getItem("token")){
      let data = JSON.parse(localStorage.getItem("token"));
      setToken(data);
    }
    else{
      setToken(false);
    }
  },[]);


  return (
    <>
      <Router>
        {/* <NavBar /> */}
        <Routes>
          <Route exact path="/" element={<Welcome />} />
          <Route exact path="/signin" element={<Signin setToken={setToken}/>} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/forgot-password" element={<ForgotPass/>} />
          <Route exact path="/update-password" element={<ResetPass/>} />
          {token?<Route exact path="/home" element={<Home token={token}/>} />:""}
          {token?<Route exact path="/latest-episodes" element={<RecentEpisodes token={token}/>} />:""}
          {token?<Route exact path="/hiro" element={<Chatbot/>} />:""}
          {token?<Route exact path="/news" element={<NewsBoard/>} />:""}
          {token?<Route exact path="/schedule" element={<Schedule/>} />:""}
          {token?<Route exact path="/search/:searchId" element={<SearchPage/>} />:""}
          {token?<Route exact path="/genre/:genreId" element={<GenresPage/>} />:""}
          {token?<Route exact path="/details/:id" element={<VideoInfo/>} />:""}
          {token?<Route exact path="/watch/:id" element={<VideoMain/>} />:""}
          {token?<Route exact path="/manga" element={<Manga/>} />:""}
          {token?<Route exact path="/manga/details/:id" element={<MangaInfo/>} />:""}
          {token?<Route exact path="/manga/read/:chapId/:lang/:chap" element={<MangaRead/>} />:""}
          {token?<Route exact path="/profile" element={<Profile  token={token}/>} />:""}
          {token?<Route exact path="/watchlist" element={<Watchlist  token={token}/>} />:""}
          {token?<Route exact path="/history" element={<History  token={token}/>} />:""}

          {token?<Route exact path="/dmca" element={<Dmca token={token}/>} />:""}
          {token?<Route exact path="/contact" element={<Contact token={token}/>} />:""}
          {token?<Route exact path="/terms" element={<Terms token={token}/>} />:""}
          <Route path="/*" element={<Error/>} />
        </Routes>
      </Router>
    </>
  );
};

export default Routing;