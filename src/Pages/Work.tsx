import {Dispatch, ReactElement, SetStateAction, useState} from "react";
import Layout from "../Components/layout.tsx";
import hexagon from '../../public/images/SVGs/hexagon.svg'
import hexagon2 from '../../public/images/SVGs/hexagon2.svg'
import worksData from '../FileDatabase.json'
import zenaKristosPage from '../../public/images/zenakristosPage.png'
import zoePage from '../../public/images/zoePage.png'
import ymPage from '../../public/images/YMPage.png'
import emebetPage from '../../public/images/emebetPage.png'
import classicPage from '../../public/images/classic.png'
import {Link} from "react-router-dom";
import {WorksData} from "../global";


export const Work = ():ReactElement =>{
		
		const [showing, setShowing] = useState<string>();
		const [itration, setItration] = useState<number>(0);
		
		
		return (
				<Layout title={'Team'} link={'/'} lgLogoShow={false}>
						<div className="h-full z-10 relative lg:-top-20 overflow-y-scroll scrollbar">
								<div className={`py-4 text-center`}>
										<h1 className='text-4xl md:text-6xl font-bold text-pj-white text-center'>
												Works
										</h1>
										<h2 className="text-pj-white font-medium">Previous Projects</h2>
								</div>
								<div
										className={`lg:mt-7 mx-2`}
								>
										<div className={`flex justify-center gap-3 lg:gap-2 `}>
												{
														worksData.map((work, i)=>{
																if (i < 3){
																		return (
																				<WorkProfile
																						key={i}
																						name={work.title}
																						img={'../images/'+work.image}
																						tag={work.tag}
																						filled={(Math.floor(Math.random() * 1000)) % 2 === 0}
																						setShowing={setShowing}
																						clamp={work.clamp}
																				/>
																		)
																}
														})
												}
										</div>
										<div className={`flex justify-center gap-3 lg:gap-2 -mt-6 lg:-mt-8`}>
												{
														worksData.map((work, i)=>{
																if (i > 2 && i < 7){
																		return (
																				<WorkProfile
																						key={i}
																						name={work.title}
																						img={'../images/'+work.image}
																						tag={work.tag}
																						filled={(Math.floor(Math.random() * 1000)) % 2 === 0}
																						setShowing={setShowing}
																						clamp={work.clamp}
																				/>
																		)
																}
														})
												}
												
										</div>
										<div className={`flex justify-center gap-3 lg:gap-2 -mt-6 lg:-mt-8`}>
												{
														worksData.map((work, i)=>{
																if (i > 6 && i < 9){
																		return (
																				<WorkProfile
																						key={i}
																						name={work.title}
																						img={'/images/'+work.image}
																						tag={work.tag}
																						filled={(Math.floor(Math.random() * 1000)) % 2 === 0}
																						setShowing={setShowing}
																						clamp={work.clamp}
																				/>
																		)
																}
														})
												}
												{
														worksData.length < 10 &&
														Array.from({ length: 10 - worksData.length }).map((_, i) => (
																<WorkProfile
																		key={i}
																		name={''}
																		img={''}
																		tag={''}
																		filled={true}
																		setShowing={setShowing}
																		clamp={false}
																/>
														))
												}
												{
														worksData.length > 9 &&
                            <WorkProfile
                                key={null}
                                name={`And ${worksData.length - 8} more projects`}
                                img={''}
                                tag={''}
                                filled={true}
                                setShowing={setShowing}
																clamp={false}
                            />
												}
										</div>
								</div>
						</div>
				</Layout>
		)
}

type WorkProfileType = {
		key: number | null,
		name: string,
		img: string,
		tag: string,
		filled: boolean,
		setShowing: Dispatch<SetStateAction<string | undefined>>,
		clamp: boolean,
}

const WorkProfile = ({key = null, name, img, tag, filled = false, setShowing, clamp = false}: WorkProfileType): ReactElement => {
		
		return (
				<div
						key={key}
						onClick={() => setShowing(tag)}
						 className={`relative w-1/4 sm:w-32 md:w-36 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200`}
				>
						<img className="w-full z-20 mt-3" src={filled ? hexagon2 : hexagon} alt=""/>
						<div
								className="absolute z-30 w-full h-full left-0 right-0 mx-auto top-0 flex flex-col justify-center items-center gap-0.5"
						>
								<img className={`w-2/6 z-20`} src={img} alt=""/>
								<p className={`text-xs sm:text-sm px-3 ${clamp && 'line-clamp-1'} sm:line-clamp-none ${filled ? 'text-pj-white' : 'text-pj-primary'} text-center`}>{name}</p>
						</div>
				</div>
		)
}