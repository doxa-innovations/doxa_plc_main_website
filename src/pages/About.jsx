import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'

export const About = ()=>{

    const [showing, setShowing] = useState();
    const navigate = useNavigate();
    const [loading, setLoading] = useState('Error');


    return (
    <div className="h-full relative">
        <div className={`pt-14 pb-4`} onClick={()=>{setShowing(null)}}>
            <h1 className='text-3xl md:text-6xl font-bold text-pj-white text-center'>
                About
            </h1>
            <h2 hidden={showing != null}  className="text-pj-white font-medium">Get to know us a little</h2>
        </div>
       <svg 
            hidden={showing != null} 
            onClick={()=>{navigate(-1)}}
            className="fill-pj-primary absolute w-6 h-6 md:w-10 md:h-10 top-0 left-0 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
        </svg>   

        <p className="text-base md:text-lg px-10 md:px-80 mt-10 text-pj-white">
            Bee design studio is a online studio founded for the purpose of helping business have a standard brand 
            for for affordable price. It majorly focuses on the presentation of businesses to their clients. 
            <br />
            <br />
            Major members of Bee design studio are residents in Bishoftu, Ethiopia. Thus, Bee design studio aims 
            hold’s businesses in Bishoftu, Ethiopia as primary clients. The members are passionate youths who are 
            striving to help businesses reach their peak outreach. They are professional at their area. 
        </p>

        <h3 className="my-12 text-pj-white font-bold text-xl md:text-3xl">We want to work with you, so please <br /><Link to={'/contact'} className="underline text-pj-primary">Contact Us</Link> </h3>

    </div>
    )
}

