"use client"
import {Dispatch, ReactElement, SetStateAction, useState} from "react";
import worksData from '../../FileDatabase.json'
import Link from "next/link";
import LayoutOutline from "@/app/_LayoutOutline";
import Image from "next/image";

type WorkData = {
	title: string,
	image: string,
	tag: string,
	link: string,
	clamp: boolean,
	details: {
		subTitle: string,
		description: string,
		techStack: string[],
		image: string,
	}
}

export default function Work(): ReactElement {
	
	const [showing, setShowing] = useState<WorkData | null>(null);
	const hexagon2 = "https://cdn.doxaplc.com/doxa-public/SVGs/hexagon2.svg";
	
	return (
		<LayoutOutline title={'Works'} description={`Previous Projects`} backLink={'/'} lgLogoShow={false}>
			<div className="h-full grid place-items-center z-10 relative overflow-y-scroll scrollbar">
				<div
					className={`lg:mt-7 mx-2`}
				>
					<div className={`flex justify-center gap-3 lg:gap-2 `}>
						{
							worksData.map((work, key) => {
								if (key < 3) {
									return (
										<WorkProfile
											key={key}
											i={key}
											filled={work.filled}
											setShowing={setShowing}
											data={work}
										/>
									)
								}
							})
						}
					</div>
					<div className={`flex justify-center gap-3 lg:gap-2 -mt-6 lg:-mt-8`}>
						{
							worksData.map((work, key) => {
								if (key > 2 && key < 7) {
									return (
										<WorkProfile
											key={key}
											i={key}
											filled={work.filled}
											setShowing={setShowing}
											data={work}
										/>
									)
								}
							})
						}
					
					</div>
					<div className={`flex justify-center gap-3 lg:gap-2 -mt-6 lg:-mt-8`}>
						{
							worksData.map((work, key) => {
								if (key > 6 && key < 9) {
									return (
										<WorkProfile
											key={key}
											i={key}
											filled={work.filled}
											setShowing={setShowing}
											data={work}
										/>
									)
								}
							})
						}
						{
							worksData.length < 10 &&
							Array.from({length: 10 - worksData.length}).map((_, i) => (
								<WorkProfile
									key={i}
									i={i}
									filled={true}
									setShowing={setShowing}
									data={{
										title: '',
										image: 'https://cdn.doxaplc.com/doxa-public',
										tag: '',
										link: '',
										clamp: false,
										details: {
											subTitle: '',
											description: '',
											techStack: [],
											image: 'https://cdn.doxaplc.com/doxa-public',
										}
									}}
								/>
							))
						}
						{
							worksData.length > 9 &&
                            <div
                                className={`relative w-1/4 sm:w-32 md:w-36 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200`}
                            >
                                <Image className="w-full z-20 mt-3" src={hexagon2} alt=""/>
                            </div>
						}
					</div>
				</div>
			</div>
			
			<div className={`${showing === null && 'invisible'} w-full h-full absolute bottom-0 z-50`}>
				<div className={`w-full h-full relative `}>
					<div
						className={`w-full h-full bg-pj-light-Dark opacity-50 absolute z-10`}
						onClick={() => {
							setShowing(null)
						}}
					></div>
					<div
						className={`${showing === null && 'h-0' || 'h-[80%] lg:h-4/5'} w-full bg-pj-accent absolute bottom-0 z-50 transition-all duration-800 overflow-x-hidden overflow-y-scroll scrollbar`}>
						<div className={`relative w-full h-full bottom-0 px-2`}>
							<div
								className={`grid place-items-center h-16 border-b border-pj-secondary sticky top-0 bg-pj-accent`}>
								<p className={`text-lg sm:text-xl md:text-3xl text-white`}>
									{showing !== null ? showing.title : ''}
								</p>
								<div
									className={`absolute w-6 fill-pj-primary top-0 right-0 mt-4 mr-4 z-50 cursor-pointer
																				hover:scale-[1.05] hover:fill-pj-secondary transition-all duration-800`}
									onClick={() => {
										setShowing(null)
									}}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path
											d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z"/>
									</svg>
								</div>
							</div>
							<div
								className={`flex flex-wrap justify-center items-center p-5 lg:py-10`}
							>
								<div className="w-full lg:w-1/2 text-pj-white px-3 md:px-6">
									<div
										className="text-xl md:text-3xl text-pj-secondary font-semibold py-3 flex items-center justify-center">
										{showing !== null ? showing.details.subTitle : ''}
										<Link href={showing !== null ? showing.link : ''} target="_blank"
											  className="w-4 ml-3 fill-pj-primary hover:bg-opacity-80 over:scale-[1.05] hover:fill-pj-secondary transition-all duration-800">
											<svg xmlns="http://www.w3.org/2000/svg"
												 viewBox="0 0 512 512">
												<path
													d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/>
											</svg>
										</Link>
									</div>
									<p className="">
										{showing !== null ? showing.details.description : ''}
									</p>
									<h4 className="pr-2 mt-5 text-sm md:text-base text-center">Technologies Used:</h4>
									<ul className="flex gap-2 mt-2 mb-5 px-2 justify-center items-center flex-wrap">
										{
											showing !== null && showing.details.techStack.map((stack: string, key) => {
												return (
													<li key={key}
														className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">{stack}</li>
												)
											})
										}
									</ul>
								</div>
								<div
									className={`w-full lg:w-1/2 border-t-2 lg:border-t-0 lg:border-l-2 border-pj-secondary`}>
									{showing !== null && <img
                                        className="md:px-6 py-6 mx-auto"
                                        src={showing.details.image} alt=""/>
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</LayoutOutline>
	)
}

type WorkProfileType = {
	i?: number | null,
	key?: number | null,
	filled: boolean,
	setShowing: Dispatch<SetStateAction<WorkData | null>>,
	data: WorkData,
}

const WorkProfile = ({i, filled = false, setShowing, data}: WorkProfileType): ReactElement => {
	const hexagon = "https://cdn.doxaplc.com/doxa-public/SVGs/hexagon.svg";
	const hexagon2 = "https://cdn.doxaplc.com/doxa-public/SVGs/hexagon2.svg";
	
	return (
		<div
			key={i ?? 432}
			onClick={() => setShowing(data.link.length > 0 ? data : null)}
			className={`relative w-1/4 sm:w-32 md:w-36 cursor-pointer hover:-translate-y-1 transition ease-in-out duration-200`}
		>
			<img className="w-full z-20 mt-3" src={filled ? hexagon2 : hexagon} alt=""/>
			<div
				className="absolute z-30 w-full h-full left-0 right-0 mx-auto top-0 flex flex-col justify-center items-center gap-0.5"
			>
				{
					data.tag !== '' && <img
                        className={`w-5/12 z-20`} src={data.image} alt=""
                    
                    />
				}
				
				<p className={`text-xs sm:text-sm lg:text-base px-3 ${data.clamp && 'line-clamp-1 '} ${filled ? 'text-pj-white' : 'text-pj-primary'} text-center`}>{data.title}</p>
			</div>
		</div>
	)
}