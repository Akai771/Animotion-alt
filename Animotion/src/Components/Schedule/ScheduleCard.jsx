import "./Schedule.css"
import React from "react";
import { Link } from "react-router-dom";

function ScheduleCard({ title, jtitle, time, id }) {
    return (
        
        <div>
            <div class="ScheduleCard">
                <Link to={`/details/${id}`}>
                    <div className="ScheduleCardAlign">
                        <div className="timeDiv">
                            <span class="scheduleTimeTxt">{time}</span>
                        </div>
                        <span className="ver-line"/>
                        <div className="ScheduleCardCont">
                            <span class="scheduleTitleTxt">{title}</span>
                            <span class="scheduleTitleTxt2">{jtitle}</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
        
    );
}

export default ScheduleCard;