"use client"
import {ReactElement} from "react";
import LayoutOutline from "@/app/_LayoutOutline";


export default function Team(): ReactElement {
	
	const triangle = "https://cdn.doxaplc.com/doxa-public/SVGs/triangle.svg"
	const pentagon = "https://cdn.doxaplc.com/doxa-public/SVGs/pentagon.svg"
	const hexagon3 = "https://cdn.doxaplc.com/doxa-public/SVGs/hexagon3.svg"
	const EphremBW = "https://cdn.doxaplc.com/doxa-public/EphremBW.png"
	const gedion = "https://cdn.doxaplc.com/doxa-public/Gedion.avif"
	const cheri = "https://cdn.doxaplc.com/doxa-public/Cheri.avif"
	
	return (
		<LayoutOutline title={'Team'} description={`Team members & Collaborators`} backLink={'/'} lgLogoShow={false}>
			<div className="h-full mt-10 lg:mt-0 grid place-items-center z-10 relative overflow-y-scroll scrollbar">
				<div
					className={`flex flex-col lg:flex-row justify-center items-center gap-14 sm:gap-16 md:gap-24 lg:gap-32 w-full mt-16`}
				>
					<Profile bgImage={triangle} userImage={EphremBW} name={'Ephrem K. Getachew'}
							 profession={'Full Stack Developer'}/>
					
					<Profile bgImage={pentagon} userImage={cheri} name={'Cherinet D. Lemma'}
							 profession={'UI/UX Designer'}/>
					
					<Profile bgImage={hexagon3} userImage={gedion} name={'Gedion G. Tadesse'}
							 profession={'Frontend Developer'}/>
				</div>
			</div>
		
		</LayoutOutline>
	)
}

type ProfilePropsType = {
	bgImage: string,
	userImage: string,
	name: string,
	profession: string,
}

const Profile = ({bgImage, userImage, name, profession}: ProfilePropsType): ReactElement => {
	return (
		
		<div
			// onClick={()=>{setShowing('ephrem')}}
			className='relative z-20 w-3/5 lg:w-64 grid  place-items-center cursor-pointer hover:scale-105
														transition ease-in-out duration-200'
		>
			<div className="grid h-full">
				<img className="w-3/5 lg:w-11/12 relative z-30 justify-self-center self-end" src={userImage} alt=""/>
			</div>
			<div
				className="h-full w-full bg-pj-primary rounded-xl text-center p-3 -mt-1 relative z-30"
			>
				<p className="text-base md:text-xl text-pj-white pb-2 font-semibold border-b border-pj-accent">
					{name}
				</p>
				<p className="py-1 text-sm md:text-base text-pj-black">{profession}</p>
			</div>
			<img className="absolute -top-6 w-40 md:w-60" src={bgImage} alt=""/>
		</div>
	
	
	)
	
}