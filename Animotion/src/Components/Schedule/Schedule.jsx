import React, { useState, useEffect } from "react";
import NavBar from "../Navbar/Navbar";
import TopRedirect from "../TopRedirectButton/TopRedirect";
import ChatbotButton from "../Chatbot/ChatbotButton/ChatbotButton";
import ScheduleCard from "./ScheduleCard";
import axios from "axios";
import "./Schedule.css";
import Preloader from "../Preloader/Preloader";

const Schedule = () => {
    const [schedule, setSchedule] = useState([]);
    const today = new Date().toISOString().slice(0, 10);
    const [day, setDay] = useState(today);
    const [weekDates, setWeekDates] = useState([]);

    useEffect(() => {
        const getWeekDates = () => {
          const today = new Date();
          const currentDayOfWeek = today.getDay();
          const difference = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
          const startDate = new Date(today);
          startDate.setDate(today.getDate() - difference);
    
          const dates = Array.from({ length: 7 }, (_, index) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + index);
            return date.toISOString().slice(0, 10);
          });
    
          setWeekDates(dates);
        };
        getWeekDates();
      }, []);

    const handleDayChange = (e) => {
        setDay(e.target.value);
    }

    useEffect(()=>{
        axios.get(`https://animotion-aniwatch-api.vercel.app/anime/schedule?date=${day}`)
        .then((res) => setSchedule(res.data.scheduledAnimes))
        .catch((err) => console.log(err));
        Window.scrollTo({
            top: 100,
            left: 100,
            behavior: "smooth",
          });
    },[day])

    return (
    <>
        <Preloader/>
        <div className="SchedulePage">
            <NavBar/>
            <div className="scheduleAlign">
                <h1 className="scheduleTitle">SCHEDULE</h1>
                <div className="scheduleDivideLine"/>
                <div className="scheduleDayBtnGrp">
                    <div className="radio-inputs">
                        <label className="radio">
                            <input type="radio" value={weekDates[0]} checked={day == weekDates[0]} onChange={handleDayChange}/>
                            <span className="name">Sunday<span className="date">{weekDates[0]}</span></span>
                            
                        </label>
                        <label className="radio">
                            <input type="radio" value={weekDates[1]} checked={day == weekDates[1]} onChange={handleDayChange}/>
                            <span className="name">Monday<span className="date">{weekDates[1]}</span></span>
                            
                        </label>
                        <label className="radio">
                            <input type="radio" value={weekDates[2]} checked={day == weekDates[2]} onChange={handleDayChange}/>
                            <span className="name">Tuesday<span className="date">{weekDates[2]}</span></span>
                            
                        </label>
                        <label className="radio">
                            <input type="radio" value={weekDates[3]} checked={day == weekDates[3]} onChange={handleDayChange}/>
                            <span className="name">Wednesday<span className="date">{weekDates[3]}</span></span>
                            
                        </label>
                        <label className="radio">
                            <input type="radio" value={weekDates[4]} checked={day == weekDates[4]} onChange={handleDayChange}/>
                            <span className="name">Thursday<span className="date">{weekDates[4]}</span></span>
                            
                        </label>
                        <label className="radio">
                            <input type="radio" value={weekDates[5]} checked={day == weekDates[5]} onChange={handleDayChange}/>
                            <span className="name">Friday<span className="date">{weekDates[5]}</span></span>
                            
                        </label>
                        <label className="radio">
                            <input type="radio" value={weekDates[6]} checked={day == weekDates[6]} onChange={handleDayChange}/>
                            <span className="name">Saturday<span className="date">{weekDates[6]}</span></span>
                            
                        </label>
                    </div>
                </div>
                <div className="scheduleDivideLine"/>
                <span className="scheduleDayTxt">DAY: <span className="scheduleDayTxt2">{day}</span></span>
                <div className="scheduleCardBg">
                    {schedule.map((schedule) => (
                        <ScheduleCard 
                        // key={schedule.id?schedule.id:"1"} 
                        id={schedule.id}
                        title={schedule.name}
                        jtitle={schedule.jname}
                        time={schedule.time}/>
                        ))
                    }
                </div>
                <br/><br/><br/>
                
            </div>
            <ChatbotButton/>
            <TopRedirect/>
        </div>
        </>);
}

export default Schedule;