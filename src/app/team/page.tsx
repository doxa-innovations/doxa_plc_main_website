"use client"
import {ReactElement} from "react";
import triangle from '../../../public/images/SVGs/triangle.svg'
import pentagon from '../../../public/images/SVGs/pentagon.svg'
import hexagon3 from '../../../public/images/SVGs/hexagon3.svg'
import EphremBW from '../../../public/images/EphremBW.png'
import gedion from '../../../public/images/Gedion.png'
import cheri from '../../../public/images/Cheri.png'
import LayoutOutline from "@/app/_LayoutOutline";
import Image, {StaticImageData} from "next/image";
import StatCardRow from "@/Components/StatCardRow";

export default function Team(): ReactElement {
		
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
		userImage: string | StaticImageData,
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
                    <Image className="w-3/5 lg:w-11/12 relative z-30 justify-self-center self-end" src={userImage} alt=""/>
                </div>
                <div
                    className="h-full w-full bg-pj-primary rounded-xl text-center p-3 -mt-1 relative z-30"
                >
                    <p className="text-base md:text-xl text-pj-white pb-2 font-semibold border-b border-pj-accent">
                        {name}
                    </p>
                    <p className="py-1 text-sm md:text-base text-pj-black">{profession}</p>
                </div>

                <Image className="absolute -top-6 w-40 md:w-60" src={bgImage} alt=""/>

            </div>




		)

}