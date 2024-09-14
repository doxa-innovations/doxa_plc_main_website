import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import triangle from '../images/SVGs/triangle.svg'
import pentagon from '../images/SVGs/pentagon.svg'
import hexagon3 from '../images/SVGs/hexagon3.svg'
import circle from '../images/SVGs/circle.svg'
import EphremBW from '../images/EphremBW.png'
import ephremPic from '../images/Ephrem.png'
import gedion from '../images/gedion.png'
import user from '../images/user.png'


export const Team = ()=>{

    const [showing, setShowing] = useState();
    const navigate = useNavigate();

    return (
    <div className="h-full relative z-10">
            <div className={`pt-14 pb-4`}>
            <h1 className='text-3xl md:text-6xl font-bold text-pj-white text-center'>
                Team
            </h1>
                <h2 className="text-pj-white font-medium">Team members & Collaborators</h2>
        </div>        
       <svg 

            onClick={()=>{navigate(-1)}}
            className="fill-pj-primary absolute w-6 h-6 md:w-10 md:h-10 top-0 left-0 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
        </svg>

            <div className={`flex flex-col md:flex-row justify-center gap-2 md:gap-32 w-full absolute top-1/2 transform -translate-y-1/2`}>
            <div
                // onClick={()=>{setShowing('ephrem')}} 
                className='relative grid place-items-center cursor-pointer hover:scale-105 transition ease-in-out duration-200'
            >
                    <img className="w-24 md:w-48 relative z-30" src={EphremBW} alt="" />
                <div className="w-52 md:w-64 h-20 md:h-24 bg-pj-secondary rounded-xl text-center px-3 relative z-30">
                    <p className="text-base md:text-xl text-pj-accent pt-3 pb-2 font-semibold border-b border-pj-accent">
                        Ephrem K. Getachew
                    </p>
                    <p className="pt-1 text-sm md:text-base md:pt-3 text-pj-black">Full Stack Developer</p>
                </div>

                <img className="absolute top-2 w-32 md:w-60" src={triangle} alt="" />
                
            </div>

            <div
                // onClick={()=>{setShowing('cherinet')}} 
                className='relative grid place-items-center cursor-pointer hover:scale-105 transition ease-in-out duration-200'
            >
                    <img className="w-24 md:w-36 relative z-30 self-end" src={user} alt="" />
                <div className="w-52 md:w-64 h-20 md:h-24 bg-pj-secondary rounded-xl text-center px-3 relative z-30">
                    <p className="text-base md:text-xl text-pj-accent pt-3 pb-2 font-semibold border-b border-pj-accent">
                        Cherinet D. Lemma
                    </p>
                    <p className="pt-1 text-sm md:text-base md:pt-3 text-pj-black">Creative Designer</p>
                </div>

                <img className="absolute top-5 w-32 md:w-60" src={pentagon} alt="" />
            </div>

            <div
                // onClick={()=>{setShowing('gedion')}} 
                className='relative grid place-items-center cursor-pointer hover:scale-105 transition ease-in-out duration-200'
            >
                    <img className="w-24 md:w-36 relative z-30 self-end" src={user} alt="" />
                <div className="w-52 md:w-64 h-20 md:h-24 bg-pj-secondary rounded-xl text-center px-3 relative z-30">
                    <p className="text-base md:text-xl text-pj-accent pt-3 pb-2 font-semibold border-b border-pj-accent">
                        Gedion G. Tadesse
                    </p>
                    <p className="pt-1 text-sm md:text-base md:pt-3 text-pj-black">Frontend Developer</p>
                </div>

                <img className="absolute top-5 w-32 md:w-60" src={hexagon3} alt="" />
            </div>
            </div>
    </div>
    )
}


const Ephrem = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-[80%] bg-pj-dark bottom-0 absolute z-30 px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Ephrem K. Getachew</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-7 py-5 md:py-10">
                    <div className="col-span-3 text-pj-white px-3 md:px-6">
                        <h4 className="text-xl md:text-3xl text-pj-secondary font-semibold pb-2 md:py-5">Full Stack Developer</h4>
                        <p className="">
                            Ephrem K Getachew is a developer of both front end and back end. He uses React and Tailwind 
                            for most of  you his front end jobs and for the back end he used server side languages like, 
                            PHP and NodeJS. He works on Laravel and Express projects. 
                        </p>
                    </div>
                    <div className="md:w-2 md:h-full bg-pj-secondary"></div>
                    <div className="col-span-3 mx-auto relative">
                        <img className="w-64 relative z-30" src={ephremPic} alt="" />
                        <img className="absolute top-12 left-2 w-72" src={circle} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Cherinet = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-[80%] bg-pj-dark bottom-0 absolute z-30 px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Cherinet D. Lema</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-7 py-5 md:py-10">
                    <div className="col-span-3 text-pj-white px-3 md:px-6">
                        <h4 className="text-xl md:text-3xl text-pj-secondary font-semibold pb-2 md:py-5">Full Stack Developer</h4>
                        <p className="">
                            Cherinet D. Lema is graphics designer  is a developer of both front end and back end. He uses React and Tailwind 
                            for most of  you his front end jobs and for the back end he used server side languages like, 
                            PHP and NodeJS. He works on Laravel and Express projects. 
                        </p>
                    </div>
                    <div className="md:w-2 md:h-full bg-pj-secondary"></div>
                    <div className="col-span-3 mx-auto relative">
                        <img className="w-64 relative z-30" src={ephremPic} alt="" />
                        <img className="absolute top-12 left-2 w-72" src={circle} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}


const Gedion = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-[80%] bg-pj-dark bottom-0 absolute z-30 px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Ephrem K. Getachew</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-7 py-5 md:py-10">
                    <div className="col-span-3 text-pj-white px-3 md:px-6">
                        <h4 className="text-xl md:text-3xl text-pj-secondary font-semibold pb-2 md:py-5">Full Stack Developer</h4>
                        <p className="">
                            Ephrem K Getachew is a developer of both front end and back end. He uses React and Tailwind 
                            for most of  you his front end jobs and for the back end he used server side languages like, 
                            PHP and NodeJS. He works on Laravel and Express projects. 
                        </p>
                    </div>
                    <div className="md:w-2 md:h-full bg-pj-secondary"></div>
                    <div className="col-span-3 mx-auto relative">
                        <img className="w-64 relative z-30" src={gedion} alt="" />
                        <img className="absolute top-12 left-2 w-72" src={circle} alt="" />
                    </div>
                </div>
            </div>
        </div>
    )
}
