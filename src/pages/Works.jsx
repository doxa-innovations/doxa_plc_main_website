import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import logo from '../images/logo.png'
import hexagon from '../images/SVGs/hexagon.svg'
import hexagon2 from '../images/SVGs/hexagon2.svg'
import zenaKristos from '../images/zenakristos.png'
import yeneta from '../images/yenetaMaster.png'
import kofficho from '../images/kofficho.png'
import maor from '../images/maor.png'
import zoe from '../images/Zoe.png'
import emebet from '../images/emebet.png'
import lce from '../images/lce.png'
import zenaKristosPage from '../images/zenakristosPage.png'
import zoePage from '../images/zoePage.png'
import ymPage from '../images/YMPage.png'
import emebetPage from '../images/emebetPage.png'
import classic from '../images/classic.png'

export const Works = ()=>{

    const [showing, setShowing] = useState();
    const navigate = useNavigate();

    return (
    <div className="h-full relative">
        <div className={`pt-14 pb-4`} onClick={()=>{setShowing(null)}}>
            <h1 className='text-3xl md:text-6xl font-bold text-pj-white text-center'>
                Works
            </h1>
            <h2 hidden={showing != null}  className="text-pj-white font-medium">Previous Projects</h2>
        </div>
       <svg 
            hidden={showing != null} 
            onClick={()=>{navigate(-1)}}
            className="fill-pj-primary absolute w-6 h-6 md:w-10 md:h-10 top-0 left-0 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
        </svg>   

        <div className={`${showing == null && 'hidden md:flex' || 'hidden'} flex-col items-center mt-4 w-full absolute top-1/2 transform -translate-y-1/2`}>
            <div className='grid grid-flow-col col-span-5 w-fit -mb-6 gap-3'>
                <div onClick={()=>setShowing('zenaKristos')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-14 z-20" src={zenaKristos} alt="" />
                        <p className='text-sm text-pj-primary'>Zena Kristos</p>
                    </div>
                </div>
                <div onClick={()=>setShowing('yenetaMaster')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-12 z-20" src={yeneta} alt="" />
                        <p className='text-sm text-pj-primary'>Yeneta Master</p>
                    </div>
                </div>
                    <div onClick={() => setShowing('Classic')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon2} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                            <img className="w-20 z-20" src={classic} alt="" />
                            <p className='text-sm text-pj-white px-4'>Classic Noodle & Burger</p>
                    </div>
                </div>
                <div onClick={()=>setShowing('kofficho')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-14 z-20" src={kofficho} alt="" />
                            <p className='text-sm text-pj-primary px-4'>Kofficho Coffee</p>
                    </div>
                </div>
                <Link to={'/contact'} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon2} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <p className='text-pj-white px-2'>Put Your Business Right Here</p>
                    </div>
                </Link>
            </div>
          
            <div className='grid grid-flow-col col-span-4 gap-3'>
                <div onClick={()=>setShowing('zoe')} className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon2} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-16 z-20" src={zoe} alt="" />
                        <p className='text-sm text-pj-white'>Zoe Delivery</p>
                    </div>
                </div>
                <div onClick={()=>setShowing('emebet')} className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-8 z-20" src={emebet} alt="" />
                        <p className='text-sm text-pj-primary px-2'>Dr Emebet Dental</p>
                    </div>
                </div>
                <div onClick={()=>setShowing('lce')} className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon2} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-14 z-20 -mt-6" src={lce} alt="" />
                        <p className='text-sm text-pj-white'>The LCE</p>
                    </div>
                </div>
                    <div className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <p className='text-pj-primary px-2'>Even More to Come</p>
                    </div>
                </div>
            </div>
        </div>



        <div className='flex md:hidden flex-col items-center mt-20'>
            <div className='grid grid-flow-col col-span-2 w-fit -mb-5 md:-mb-6 gap-2'>
                <div onClick={()=>setShowing('zenaKristos')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-14 z-20" src={zenaKristos} alt="" />
                        <p className='text-sm text-pj-primary'>Zena Kristos</p>
                    </div>
                </div>
            </div>
            <div className='grid grid-flow-col col-span-2 w-fit -mb-5 md:-mb-6 gap-2'>
                <div onClick={()=>setShowing('yenetaMaster')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-12 z-20" src={yeneta} alt="" />
                        <p className='text-sm text-pj-primary'>Yeneta Master</p>
                    </div>
                </div>
                <div onClick={()=>setShowing('zoe')} className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon2} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-16 z-20" src={zoe} alt="" />
                        <p className='text-sm text-pj-white'>Zoe Delivery</p>
                    </div>
                </div>
            </div>
          
            <div className='grid grid-flow-col col-span-3 gap-2'>
                <div onClick={()=>setShowing('emebet')} className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-8 z-20" src={emebet} alt="" />
                        <p className='text-sm text-pj-primary px-2'>Dr Emebet Dental</p>
                    </div>
                </div>

                <div onClick={()=>setShowing('kofficho')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-14 z-20" src={kofficho} alt="" />
                        <p className='text-sm text-pj-primary'>Kofficho Coffee</p>
                    </div>
                </div>

                <div onClick={()=>setShowing('lce')} className='relative w-32 cursor-pointer hover:translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-14 z-20 -mt-6" src={lce} alt="" />
                        <p className='text-sm text-pj-primary'>The LCE</p>
                    </div>
                </div>
            </div>

          
            <div className='grid grid-flow-col col-span-2 w-fit -mt-5 gap-2'>
                <div onClick={()=>setShowing('maor')} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon2} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <img className="w-12 z-20" src={maor} alt="" />
                        <p className='text-sm text-pj-white'>Maor Seminary (MLTS)</p>
                    </div>
                </div>
            
                <Link to={'/contact'} className='relative w-32 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200'>
                        <img className="w-36 z-20" src={hexagon} alt="" />
                        <div className="absolute z-30 w-full h-full left-0 top-0 flex flex-col justify-center items-center gap-0.5">
                        <p className='text-pj-primary px-2'>Put Your Business Right Here</p>
                    </div>
                </Link>
            </div>
        </div>


        {showing == 'zenaKristos' && <ZenaKristos showing={showing} setShowing={setShowing} />}
        {showing == 'yenetaMaster' && <YenetaMaster showing={showing} setShowing={setShowing} />}
            {showing == 'Classic' && <Classic showing={showing} setShowing={setShowing} />}
        {showing == 'kofficho' && <Kofficho showing={showing} setShowing={setShowing} />}
        {showing == 'zoe' && <Zoe showing={showing} setShowing={setShowing} />}
        {showing == 'emebet' && <Emebet showing={showing} setShowing={setShowing} />}
        {showing == 'lce' && <Lce showing={showing} setShowing={setShowing} />}


    </div>
    )
}


const ZenaKristos = ({ showing, setShowing }) => {
    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">ዜና ክርስቶስ || Christ Chronicles</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            A Podcast Website
                            <Link to={"https://zenakristos.org"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            This website was built for Amharic readers  in 2022 GC and was updated in 2023. 
                            It has an article pages, Podcasts and more. It also includes a CMS(Content Management System) 
                            that helps to upload articles and perform other dynamic changes.                            
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Laravel</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Tailwind</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={zenaKristosPage} alt="" />
                </div>
            </div>
        </div>
    )
}

const YenetaMaster = ({ showing, setShowing }) => {
    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Yeneta Master Schools</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            A School Managment Web App
                            <Link to={"https://yenetamaster.net"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            Yeneta Master is a website application that allows schools to manage their students, teachers and 
                            other workers. It accomplishes this by helping owners and administrators to regularly check on attendances, 
                            grades and disciplines. Yeneta Master is built based on a strong structural design enabling parallal workload. 
                            It is also built so that teachers can manage their students while parents can see their children's progress.                
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Blade</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Bootstrap</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Laravel</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Inispinia Template</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={ymPage} alt="" />
                </div>
            </div>
        </div>
    )
}

const Classic = ({ showing, setShowing }) => {
    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Classic Noodle & Burger</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            Classic Noodle & Burger
                            <Link to={"https://classicnoodle.com"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            At Classic Noodle and Burger, we believe in bringing people together through the joy of food and music.
                            Nestled in the heart of Bishoftu, our restaurant offers a delightful fusion of mouthwatering noodles and
                            delectable burgers, perfect for every palate and occasion.
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">React</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Tailwind</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Laravel</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={classic} alt="" />
                </div>
            </div>
        </div>
    )
}

const Kofficho = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Kofficho Coffee</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            A Coffee Bean Trader Website
                            <Link to={"https://yenetamaster.net"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            Kofficho Coffee is an informative website about a Coffee Bean exporter company. They harvest and collect 
                            coffee beans and process them through variety of cleaning process. Finally pack them in tons and export them
                            demanding countries in other countries. Their website is built with informating the customer businesses in mind.
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Bootstrap</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Blade</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Laravel</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={kofficho} alt="" />
                </div>
            </div>
        </div>
    )
}

const Zoe = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Zoe Plant Delivary</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            A Plant Delivery Service Web App
                            <Link to={"https://zoedelivery.com"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            Zoe Delivery is a company that sells and delivers various types of plants and pots to customers. 
                            It also provides gardeners who can take care of the plants and green areas. The company promises to 
                            deliver the plants quickly and seamlessly from the nearest florist to the customer’s doorsteps. 
                            The Website is built to attract customers and give them a seemless experience. On top of the stylish
                            presentation it was built with a strong backend CMS(content managment system) based on world class 
                            libraries and templates.                      
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">React</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Tailwind</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Laravel</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={zoePage} alt="" />
                </div>
            </div>
        </div>
    )
}

const Emebet = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">Dr Emebet Dental Clinic</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            A Special Higher Dental Clinic Website
                            <Link to={"https://dremebetclinic.com/"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            Dr. Emebet Special Higher Dental Clinic is a unique dental clinic in Ethiopia with a team of 9 certified 
                            professional Doctors and multiple dental hygienists, assistants and dental technicians, who have a passion 
                            for the science and art of dentistry. Our team of highly competent dental specialists, hygienists and support 
                            staff are committed to giving you the best, most up-to-date and friendliest dental healthcare there is. 
                            We treat each client with utmost respect, courtesy, professionalism, honesty, and confidentiality.                     
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Bootstrap</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Blade</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">Laravel</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={emebetPage} alt="" />
                </div>
            </div>
        </div>
    )
}

const Lce = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 pb-8 px-5 md:px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-2xl md:text-4xl font-bold text-pj-primary py-5">The Lutheran Church of Ethiopia</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 pt-3 md:py-10">
                    <div className="col-span-2 text-pj-white px-3 md:px-6">
                        <div className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
                            A Church Website
                            <Link to={"https://dremebetclinic.com/"} target="_blank" className="px-6 py-2 mx-3 w-fit text-base rounded-full bg-pj-accent text-pj-secondary hover:bg-opacity-80">
                                Visit
                            </Link>
                        </div>
                        <p className="">
                            A Confessional Lutheran Church                     
                        </p>
                        <ul className="flex gap-2 my-5 px-2 items-center flex-wrap">
                            <h4 className="pr-2 text-sm md:text-base">Technologies Used:</h4>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">React</li>
                            <li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">SCSS</li>
                        </ul>
                    </div>
                    <img className="col-span-2 md:px-6 py-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary" src={emebetPage} alt="" />
                </div>
            </div>
        </div>
    )
}