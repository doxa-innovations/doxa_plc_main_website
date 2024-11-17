import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import html from '../images/html.png'


export const Prices = ()=>{

    const [showing, setShowing] = useState(0);
    const navigate = useNavigate();
    const [customs, setCustoms] = useState(window.location.hash == '#customs');

    return (
    <div className="h-full relative z-10">
        <div className={`pt-14 pb-4`}>
            <h1 className='text-3xl md:text-6xl font-bold text-pj-white text-center'>
                Prices
            </h1>
            <h2 className="text-pj-white font-medium">Services for Affordable</h2>
        </div>        
       <svg 
            onClick={()=>{navigate(-1)}}
            className="fill-pj-primary absolute w-6 h-6 md:w-10 md:h-10 top-0 left-0 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
        </svg>

        <div className={`flex flex-col md:flex-row flex-wrap justify-center gap-5 md:mt-14 w-full absolute top-1/2 transform -translate-y-1/2`}>
            <div
                className={`${showing != 0 && 'hidden md:block'} ${customs && '!hidden'} w-[21rem] md:w-3/12 h-fit bg-pj-accent text-pj-white py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}
            >
                <div className="flex items-center pt-3 pb-5">
                <svg className="w-10 h-10 fill-pj-white mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>
                    <div>
                        <h3 className="text-xl md:text-2xl font-semibold">Static <span className="font-light">Website</span></h3>
                        <p className="text-sm ">Upto 5 Pages</p>
                    </div>
                </div>
                         
                <p className="text-sm text-start">
                    Informatory website built with HTML, CSS and fair use of Javascript to notify customers of your business...
                </p>

                <h4 className="text-4xl w-full border-b border-pj-white text-end pt-3 py-3 font-bold">
                    <span className="text-base mx-1">Up to</span> 
                    30,000
                    <span className="text-base mx-1">ETB</span>
                </h4>
                <ul className="px-3 pt-3">
                    <li className="flex gap-1 items-center mb-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Website Design Included</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Clean & Responsive Design</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Basic Contact Forms</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Image Optimization</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Basic SEO</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">FREE 1 Year Domain & Hosting</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm flex items-center gap-0.5">
                            FREE 1 Year Warranty
                            <span title="If you enter our Subcription package we will provide unlimited warranty.">
                                <svg  className="w-3 h-3 fill-pj-white cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            </span>
                        </p>
                    </li>
                </ul>

                <div
                    onClick={()=>{navigate('/contact')}}
                    className="px-8 py-2 w-44 mx-auto mb-2 mt-4 bg-pj-white text-pj-accent rounded-full cursor-pointer hover:bg-pj-accent hover:border border-pj-white hover:text-pj-white duration-300"
                >
                    Contact Us
                </div>
            </div>

            <div
                className={`${showing != 1 && 'hidden md:block'} ${customs && '!hidden'} w-[21rem] md:w-3/12 h-fit bg-pj-secondary text-pj-accent py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}
            >

                <div className="flex items-center pt-3 pb-5">
                    <svg className="w-10 h-10 fill-pj-accent mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M192 32c0 17.7 14.3 32 32 32c123.7 0 224 100.3 224 224c0 17.7 14.3 32 32 32s32-14.3 32-32C512 128.9 383.1 0 224 0c-17.7 0-32 14.3-32 32zm0 96c0 17.7 14.3 32 32 32c70.7 0 128 57.3 128 128c0 17.7 14.3 32 32 32s32-14.3 32-32c0-106-86-192-192-192c-17.7 0-32 14.3-32 32zM96 144c0-26.5-21.5-48-48-48S0 117.5 0 144L0 368c0 79.5 64.5 144 144 144s144-64.5 144-144s-64.5-144-144-144l-16 0 0 96 16 0c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48l0-224z"/></svg>
                    <div>
                        <h3 className="text-xl md:text-2xl font-semibold">Blog Post <span className="font-light">Website</span></h3>
                        <p className="text-sm ">Upto 2 Custom Designs</p>
                    </div>
                </div>
                         
                <p className="text-sm text-start">
                    Take control the content shown on your website for better engagement, blog post and etc ...
                </p>

                <h4 className="text-4xl w-full border-b border-pj-accent text-end pt-3 py-3 font-bold">
                        60,000
                    <span className="text-base mx-1">ETB</span>
                </h4>
                <ul className="px-3 pt-3">
                    <li className="flex gap-1 items-center mb-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Clean & Responsive Design</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">CMS Admin Panel</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Custom Forms</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Blog Post</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Advanced SEO</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">FREE 1 Year Domain & Hosting</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm flex items-center gap-0.5">
                            FREE 1 Year Warranty
                            <span title="If you enter our Subcription package we will provide unlimited warranty.">
                                <svg  className="w-3 h-3 fill-pj-accent cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            </span>
                        </p>
                    </li>
                </ul>

                <div
                    onClick={()=>{navigate('/contact')}}
                    className="px-8 py-2 w-44 mx-auto mb-2 mt-4 bg-pj-accent text-pj-white rounded-full cursor-pointer hover:bg-pj-white hover:text-pj-accent duration-300"
                >
                    Contact Us
                </div>
            </div>

            <div
                className={`${showing != 2 && 'hidden md:block'} ${customs && '!hidden'} w-[21rem] md:w-3/12 h-fit bg-pj-secondary text-pj-accent py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}
            >
                <div className="flex items-center pt-3 pb-5">
                    <svg className="w-10 h-10 fill-pj-accent mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M353.8 54.1L330.2 6.3c-3.9-8.3-16.1-8.6-20.4 0L286.2 54.1l-52.3 7.5c-9.3 1.4-13.3 12.9-6.4 19.8l38 37-9 52.1c-1.4 9.3 8.2 16.5 16.8 12.2l46.9-24.8 46.6 24.4c8.6 4.3 18.3-2.9 16.8-12.2l-9-52.1 38-36.6c6.8-6.8 2.9-18.3-6.4-19.8l-52.3-7.5zM256 256c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H384c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32H256zM32 320c-17.7 0-32 14.3-32 32V480c0 17.7 14.3 32 32 32H160c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H32zm416 96v64c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32V416c0-17.7-14.3-32-32-32H480c-17.7 0-32 14.3-32 32z"/></svg>
                    <div>
                        <h3 className="text-xl md:text-2xl font-semibold">Premium <span className="font-light">Package</span></h3>
                            <p className="text-sm ">Business Kit</p>
                    </div>
                </div>     
                <p className="text-sm text-start">
                    Boost your business's outreach...
                </p>
                <h4 className="text-4xl w-full border-b border-pj-accent text-end pt-3 py-3 font-bold">
                    <span className="text-base mx-1">Starting from</span> 
                    100,000
                    <span className="text-base mx-1">ETB</span>
                </h4>
                <ul className="px-3 pt-3">
                    <li className="flex gap-1 items-center mb-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Clean & Responsive Informatory Website</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Logo Design and Branding</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Business Cards and Fliers</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Marketing Materials</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">Social Media Integration</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">FREE Website Training</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm">FREE 1 Year Domain & Hosting</p>
                    </li>
                    <li className="flex gap-1 items-center my-2">
                        <svg className="w-4 h-4 fill-pj-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                        </svg>
                        <p className="text-sm flex items-center gap-0.5">
                            FREE 1 Year Warranty
                            <span title="If you enter our Subcription package we will provide unlimited warranty.">
                                <svg  className="w-3 h-3 fill-pj-accent cursor-pointer" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            </span>
                        </p>
                    </li>
                </ul>
                <div
                    onClick={()=>{navigate('/contact')}}
                    className="px-8 py-2 w-44 mx-auto mb-2 mt-4 bg-pj-accent text-pj-white rounded-full cursor-pointer hover:bg-pj-white hover:text-pj-accent duration-300"
                >
                    Contact Us
                </div>
            </div>

            <div className={`${!customs && '!hidden'} block w-[21rem] md:w-6/12 h-fit bg-pj-secondary text-pj-accent py-3 px-5 mx-auto md:mx-0 rounded-lg hover:-translate-y-2 transition duration-500`}>
                <div className="grid place-items-center pt-3 pb-5">
                    <svg className="w-10 h-10 fill-pj-accent mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"/></svg>
                    <div>
                        <h3 className="text-xl md:text-2xl font-semibold">Custom <span className="font-light">Buildes</span></h3>
                            <p className="text-sm ">Business Managment Kit</p>
                    </div>
                </div>     
                <p className="text-lg text-center">
                    A Package for Businesses that need special Web Apps. These web apps could be Telegram bots, 
                    eCommerce apps, ERP systems, Management apps or any Digital Solution for your Business
                </p>
                <h4 className="text-4xl w-full border-b border-pj-accent text-center pt-3 py-3 font-bold">
                    <span className="text-base mx-1">It comes with</span>
                    Custom Pricing
                    <span className="text-base mx-1">Fitting Your Business Needs</span>
                </h4>
                <p className="text-lg">
                    Contact us so we can build you a system that you can rely on
                </p>
                <div
                    onClick={()=>{navigate('/contact')}}
                    className="px-8 py-2 w-44 mx-auto mb-2 mt-4 bg-pj-accent text-pj-white rounded-full cursor-pointer hover:bg-pj-white hover:text-pj-accent duration-300"
                >
                    Contact Us
                </div>
            </div>

            <div className={`${customs && 'hidden'} w-full mt-10 md:hidden`}>
                <button
                    onClick={()=>{setShowing(showing+1)}}
                >
                    <svg className={`${showing >= 2 && 'hidden'} w-10 h-10 mx-5 fill-pj-primary`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                </button>
                <button
                    onClick={()=>{setShowing(showing-1)}}
                >
                    <svg className={`${showing <= 0 && 'hidden'} w-10 h-10 mx-5 fill-pj-primary rotate-180`}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                </button>
            </div>
            
        </div>
        <div className="grid items-end absolute md:right-[10%] w-full md:w-auto md:top-20 bottom-20 md:bottom-auto">
            <button onClick={()=>{setCustoms(!customs)}} className="w-fit px-10 h-12 mx-auto bg-pj-secondary grid place-content-center rounded-lg cursor-pointer hover:bg-opacity-90 duration-200">
                {!customs && <h3 className="text-lg">Looking for Something Powerfull?</h3> || <h3 className="text-lg">Looking for Something Regular?</h3>}                
            </button>
        </div>
        

    </div>
    )
}
