import React, {useState} from "react";
import "./Navbar.css"
import { Link, useNavigate } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import SearchIcon from '@mui/icons-material/Search';

function NavBar() {
	const [clicked, setClicked] = useState(false);
	const [search, setSearch] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const navigate = useNavigate();
	const handleClick = () => {
		setClicked(!clicked);
	};

	const handleSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(search);
		navigate(`/search/${search}`);

    }

	const handleChange = (e) => {
        setSearch(e.target.value);
    }


	return (
		<header>
			<div id="mobile" onClick={handleClick}>
            	<i id="bar" className={clicked ? "fas fa-times" : "fas fa-bars"}/>
          	</div>
			<div className="navBar">
				<nav id="navbar" className={clicked ? "#navbar active" : "#navbar"}>
					<Link to="/home" className="logoLink">
						<span className="navLogo">AniMotion</span>
					</Link>
					<Link to="/manga">Manga</Link>
					<Link to="/news">News</Link>
					<Link to="/schedule">Schedule</Link>
				</nav>
				<div className="alignProfileIcon">
					<div className="searchIcon">
						<form className="AnimeSearchBox" onSubmit={handleSubmit}>
							<input type="text" className="SearchAnimeInputBox" placeholder="Search anime..." onChange={handleChange}/>
							<button className="searchAnime_btn" type="submit">
								<SearchIcon style={{color:"white"}}/>
							</button>
						</form>
					</div>
					<ProfileIcon/>
				</div>
			</div>
		</header>
	);
}

export default NavBar;