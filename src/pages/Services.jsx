import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import hexagon2 from '../images/SVGs/hexagon2.svg'
import branding from '../images/SVGs/branding.svg'
import website from '../images/SVGs/website.svg'
import promotion from '../images/SVGs/promotion.svg'
import brandingPic from '../images/branding.png'
import websitePic from '../images/website.png'
import promotionPic from '../images/promotion.png'

export const Services = ()=>{

    const [showing, setShowing] = useState();
    const navigate = useNavigate();

    return (
    <div className="h-full relative">
        <div className={`pt-14 pb-4`} onClick={()=>{setShowing(null)}}>
            <h1 className='text-3xl md:text-6xl font-bold text-pj-white text-center'>
                Services
            </h1>
            <h2 hidden={showing != null}  className="text-pj-white font-medium">Affordable and Reliable</h2>
        </div>        
        <svg 
            hidden={showing != null} 
            onClick={()=>{navigate(-1)}}
            className="fill-pj-primary absolute w-6 h-6 md:w-10 md:h-10 top-0 left-0 mx-4 md:mx-10 my-5 cursor-pointer hover:fill-pj-secondary"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
        >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"/>
        </svg>

        <div className={`${showing == null && 'flex' || 'hidden'} flex-col md:flex-row items-center justify-center gap-5 md:gap-40 w-full absolute top-1/2 transform -translate-y-1/2`}>
            <div
                onClick={()=>{setShowing('branding')}} 
                className='relative w-28 md:w-44 cursor-pointer hover:scale-105 transition ease-in-out duration-200'
            >
                <img className="w-28 md:w-44" src={hexagon2} alt="" />
                <div className="absolute flex flex-col items-center justify-center w-28 md:w-44 top-1/2 transform -translate-y-1/2">
                    <img className="w-10 md:w-14" src={branding} alt="" />
                    <p className='text-base md:text-2xl text-pj-white -mb-1 md:-mb-3 mt-1 md:mt-3'>Branding</p>
                </div>
            </div>

            <div
                onClick={()=>{setShowing('website')}}
                className='relative w-28 md:w-44 cursor-pointer hover:scale-105 transition ease-in-out duration-200'
            >
                <img className="w-28 md:w-44" src={hexagon2} alt="" />
                <div className="absolute flex flex-col items-center justify-center w-28 md:w-44 top-1/2 transform -translate-y-1/2">
                    <img className="w-10 md:w-14" src={website} alt="" />
                    <p className='text-base md:text-2xl text-pj-white -mb-1 md:-mb-3 mt-1 md:mt-3'>Website</p>
                </div>
            </div>

            <div
                onClick={()=>{setShowing('promotion')}}
                className='relative w-28 md:w-44 cursor-pointer hover:scale-105 transition ease-in-out duration-200'
            >
                <img className="w-28 md:w-44" src={hexagon2} alt="" />
                <div className="absolute flex flex-col items-center justify-center w-28 md:w-44 top-1/2 transform -translate-y-1/2">
                    <img className="w-10 md:w-14" src={promotion} alt="" />
                    <p className='text-base md:text-2xl text-pj-white -mb-1 md:-mb-3 mt-1 md:mt-3'>Promotion</p>
                </div>
            </div>
        </div>

        
        {showing == 'branding' && <Branding showing={showing} setShowing={setShowing} />}
        {showing == 'website' && <Website showing={showing} setShowing={setShowing} />}
        {showing == 'promotion' && <Promotion showing={showing} setShowing={setShowing} />}


    </div>
    )
}


const Branding = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-4xl font-bold text-pj-primary py-5">Branding</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 md:py-10">
                    <div className="col-span-2 text-pj-white px-6">
                        <h4 className="text-3xl text-pj-secondary font-semibold pt-5 pb-1 md:py-5">It's Important</h4>
                        <p className="">
                            Branding is important because it helps you create a unique identity and personality for your business, 
                            which can attract and retain customers, increase your visibility and credibility, and differentiate you 
                            from your competitors. Branding can also help you communicate your values, mission, and vision to your 
                            target audience, and build trust and loyalty with them.
                        </p>
                    </div>
                    <img className="col-span-2 px-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary pt-5 md:pt-0" src={brandingPic} alt="" />
                </div>
            </div>
        </div>
    )
}

const Website = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-4xl font-bold text-pj-primary py-5">Website</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 md:py-10">
                    <img className="col-span-2 px-6 border-b-2 md:border-b-0 md:border-r-2 border-pj-secondary py-5" src={websitePic} alt="" />
                    <div className="col-span-2 text-pj-white px-6">
                        <h4 className="text-3xl text-pj-secondary font-semibold ">You need one</h4>
                        <p className="">
                            A website is a powerful tool for any business that wants to reach more customers, 
                            increase its credibility, and showcase its brand. A website allows potential customers 
                            to find your business online, learn about your products or services, and contact you easily. 
                            A website also helps you establish your reputation as a professional and trustworthy business, 
                            and gives you an opportunity to display your unique value proposition and social proof.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}


const Promotion = ({showing, setShowing})=>{

    return (
        <div className={`${showing != null && 'block' || 'hidden'} w-full h-fit md:h-[80%] bg-pj-dark bottom-0 absolute z-30 px-10 transition ease-in duration-500`}>
            <div className="relative">
                <h3 className="text-4xl font-bold text-pj-primary py-5">Promotion</h3>
                <button
                    onClick={()=>{setShowing(null);}} 
                    className="text-xl md:text-2xl text-pj-secondary absolute top-0 right-0 py-5 md:p-5 hover:text-pj-primary hover:-scale-105"
                >
                    X
                </button>
                <div className="w-full h-1 bg-pj-secondary"></div>
                <div className="grid place-items-center grid-flow-row md:grid-flow-col md:grid-cols-4 gap-5 md:gap-0 md:py-10">
                    <div className="col-span-2 text-pj-white px-6">
                        <h4 className="text-3xl text-pj-secondary font-semibold pt-5 pb-1 md:py-5">How We Do It</h4>
                        <p className="">
                            We identify your target audience. Who are the people most likely to buy your product or service? 
                            What are their needs, preferences, and pain points? How can you reach them effectively?
                            Then we define your promotion objectives. What are the specific goals you want to achieve with your promotion? 
                            <span className="hidden md:block">For example, do you want to introduce a new product, increase sales, boost brand awareness, or improve 
                            customer loyalty? Choose your promotion strategies. Based on your audience and objectives, select the 
                            best methods to promote your product or service.</span>
                            We can use one or a combination of the many strategies to appeal to different stages of the marketing 
                            funnel. Finally, we implement and evaluate the promotion by executing the promotion plan according to your 
                            timeline and budget. 
                        </p>
                    </div>
                    <img className="col-span-2 px-6 border-t-2 md:border-t-0 md:border-l-2 border-pj-secondary pt-5 md:pt-0" src={promotionPic} alt="" />
                </div>
            </div>
        </div>
    )
}
