import {ReactElement, useState} from "react";
import Layout from "../Components/Layout.tsx";
import hexagon2 from "../../public/images/SVGs/hexagon2.svg";
import {LiveBGMain} from "../Components/LiveBG.tsx";
import logoPic from "../../public/images/Services/1.svg"
import graphicDesign from "../../public/images/Services/2.svg"
import brandIdentity from "../../public/images/Services/3.svg"
import productPackaging from "../../public/images/Services/4.svg"
import brandStrategy from "../../public/images/Services/5.svg"
import contentCreation from "../../public/images/Services/6.svg"
import classicImg from "../../public/images/classic.png"
import ecommerce from "../../public/images/zoePage.png"
import erpSystem from "../../public/images/YMPage.png"
import phoneApp from "../../public/images/Services/8.svg"
import cloudSystem from "../../public/images/Services/9.svg"

type Showing = {
		title: string;
		subTitle: string;
		description: string;
		techStack: string[];
		image: string;
}


const Services = (): ReactElement => {
		const [showing, setShowing] = useState<string | null>(null);
		const [slideUpData, setSlideUpData] = useState<Showing | null>(null);
		
		
		const data: Showing[] = [
				{
						title: "Logo Design",
						subTitle: "Crafting unique, memorable, and versatile logos",
						description: "Crafting unique, memorable, and versatile logos that reflect the brand's identity and vision.",
						techStack: ["Photoshop", "Illustrator"],
						image: logoPic
				},
				{
						title: "Graphic Design",
						subTitle: "Creating visual content",
						description: "Includes social media graphics, brochures, flyers, business cards, and banners that align with the brand's style.",
						techStack: ["Photoshop", "Illustrator", "InDesign"],
						image: graphicDesign
				},
				{
						title: "Brand Identity Development",
						subTitle: "Defining the brand’s style guide",
						description: "Includes color schemes, typography, and visual tone for consistent representation.",
						techStack: ["Photoshop", "Illustrator", "Canva"],
						image: brandIdentity
				},
				{
						title: "Product Packaging Design",
						subTitle: "Designing branded websites and assets",
						description: "Includes user interfaces, digital assets like email templates, and online advertisements.",
						techStack: ["Photoshop", "Illustrator", "XD", "Figma"],
						image: productPackaging
				},
				{
						title: "Brand Strategy Consulting",
						subTitle: "Offering guidance on branding essentials",
						description: "Covers the brand’s voice, positioning, target audience, and long-term marketing goals.",
						techStack: ["Google Docs", "Notion", "Trello"],
						image: brandStrategy
				},
				{
						title: "Content Creation",
						subTitle: "Planning, shooting, and publishing content",
						description: "Involves shooting high-quality photos and videos, editing, and publishing optimized content across platforms to engage the target audience effectively.",
						techStack: ["Photoshop", "Premiere Pro", "After Effects", "Final Cut Pro"],
						image: contentCreation
				},
				{
						title: "Custom Website Development",
						subTitle: "Building responsive and user-friendly websites",
						description: "Tailored website solutions designed to meet client-specific requirements.",
						techStack: ["HTML", "CSS", "JavaScript", "React", "Laravel", "Tailwind", "WordPress"],
						image: classicImg
				},
				{
						title: "Mobile App Development",
						subTitle: "Designing and developing intuitive mobile apps",
						description: "Custom mobile applications for Android and iOS platforms with a focus on user experience.",
						techStack: ["React Native", "Flutter", "Firebase", "Swift", "Kotlin"],
						image: phoneApp
				},
				{
						title: "E-commerce Solutions",
						subTitle: "Creating seamless online stores",
						description: "Includes payment integration, inventory management, and a great shopping experience.",
						techStack: ["Laravel", "Shopify", "WooCommerce", "Stripe", "PayPal"],
						image: ecommerce
				},
				{
						title: "SEO Services",
						subTitle: "Boosting online visibility",
						description: "SEO optimization, social media marketing, and ad campaign management to increase reach.",
						techStack: ["Google Ads", "Analytics", "SEMrush", "Hootsuite", "Canva"],
						image: cloudSystem
				},
				{
						title: "Cloud Integration and Hosting",
						subTitle: "Providing scalable cloud-based solutions",
						description: "Cloud hosting, storage, and collaboration tools to ensure reliability and efficiency.",
						techStack: ["AWS", "Azure", "Google Cloud", "Docker"],
						image: cloudSystem
				},
				{
						title: "ERP Systems",
						subTitle: "Developing tailored software solutions",
						description: "Optimizing business operations, finance and resource management with custom-built software and applications.",
						techStack: ["Java", "C++", "PHP", "MySQL", "MongoDB"],
						image: erpSystem
				}
		];
		
		return (
				<Layout
						title={`Services`}
						description={`Standard and Reliable`}
						backLink={'/'}
						lgLogoShow={false}
				>
						<div onClick={() => setShowing(null)}
								 className={`${showing === null && 'hidden'} absolute bottom-0 z-40 w-full h-full bg-black/70 backdrop-blur-sm transition-color duration-300`}
						></div>
						<div className="h-full relative overflow-y-scroll scrollbar">
								<div className={`mt-10 lg:mt-24 flex flex-wrap justify-center lg:gap-32`}>
										<div className='flex flex-col items-center md:mt-0 relative z-50 '>
												<div className='grid grid-flow-col col-span-2 w-fit gap-2'>
														<div
																onClick={() => setSlideUpData(data[0])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer ${showing !== 'branding' ?
																		'translate-x-8 translate-y-8 invisible' : 'visible -translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Logo Design
																</p>
														</div>
														
														<div
																onClick={() => setSlideUpData(data[1])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer ${showing !== 'branding' ?
																		'-translate-x-8 translate-y-8 invisible' : 'visible translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Graphic Design
																</p>
														</div>
												</div>
												<div className='grid grid-flow-col col-span-3 -mt-5 gap-2'>
														<div
																onClick={() => setSlideUpData(data[2])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer grid place-items-center ${showing !== 'branding' ?
																		'translate-x-8 invisible' : 'visible -translate-x-1'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Brand Identity
																</p>
														</div>
														
														<div
																className={`relative z-50 w-28 md:w-36 cursor-pointer ${showing !== 'branding' ? 'hover:scale-90' : 'hover:scale-105'} transition ease-in-out duration-500`}
																onClick={() => setShowing(showing !== 'branding' ? 'branding' : null)}
														>
																<svg className={`w-28 md:w-36 z-20 fill-pj-accent`} viewBox="0 0 177 195"
																		 xmlns="http://www.w3.org/2000/svg">
																		<g filter="url(#filter0_d_2001_7)">
																				<path
																						d="M100.25 5.67062L158.687 39.4095C165.958 43.6074 170.437 51.3654 170.437 59.7611V127.239C170.437 135.635 165.958 143.393 158.687 147.59L100.25 181.329C92.9791 185.527 84.0209 185.527 76.75 181.329L18.3125 147.59C11.0416 143.393 6.56252 135.635 6.56252 127.239V59.7611C6.56252 51.3654 11.0416 43.6074 18.3125 39.4095L76.75 5.67062C84.0209 1.47275 92.9791 1.47275 100.25 5.67062Z"
																						stroke="#b277d3" stroke-width="5" shape-rendering="crispEdges"/>
																		</g>
																</svg>
																<p className='absolute z-30 flex justify-center w-full px-3 top-1/2 transform
																-translate-y-1/2 text-sm md:text-base text-pj-white text-center'
																>
																		Branding
																</p>
														</div>
														
														<div
																onClick={() => setSlideUpData(data[3])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer grid place-items-center ${showing !== 'branding' ? '-translate-x-8 invisible' : 'visible translate-x-1'}
																 hover:scale-95	transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Product Packaging
																</p>
														</div>
												</div>
												<div className='grid grid-flow-col col-span-2 w-fit -mt-5 gap-2'>
														<div
																onClick={() => setSlideUpData(data[4])}
																className={`relative z-[999] w-24 md:w-28 cursor-pointer ${showing !== 'branding' ? 'translate-x-8 ' +
																		'-translate-y-8 invisible' : 'visible -translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																		-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Brand Strategy
																</p>
														</div>
														
														<div
																onClick={() => setSlideUpData(data[5])}
																className={`relative z-[999] w-24 md:w-28 cursor-pointer ${showing !== 'branding' ? '-translate-x-8 ' +
																		'-translate-y-8 invisible' : 'visible translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white leading-tight'>
																		Content Creation
																</p>
														</div>
												</div>
										</div>
										<div className='flex flex-col items-center -mt-10 md:mt-0 relative z-50 '>
												<div className='grid grid-flow-col col-span-2 w-fit gap-2'>
														<div
																onClick={() => setSlideUpData(data[6])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer ${showing !== 'digital' ?
																		'translate-x-8 translate-y-8 invisible' : 'visible -translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Custom Website
																</p>
														</div>
														
														<div
																onClick={() => setSlideUpData(data[7])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer ${showing !== 'digital' ?
																		'-translate-x-8 translate-y-8 invisible' : 'visible translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Mobile App
																</p>
														</div>
												</div>
												<div className='grid grid-flow-col col-span-3 -mt-5 gap-2'>
														<div
																onClick={() => setSlideUpData(data[8])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer grid place-items-center ${showing !== 'digital' ?
																		'translate-x-8 invisible' : 'visible -translate-x-1'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		E-commerce
																</p>
														</div>
														
														<div
																className={`relative z-50 w-28 md:w-36 cursor-pointer ${showing !== 'digital' ? 'hover:scale-90' : 'hover:scale-105'} transition ease-in-out duration-500`}
																onClick={() => setShowing(showing !== 'digital' ? 'digital' : null)}
														>
																<svg className={`w-full z-20 fill-pj-accent`} viewBox="0 0 177 195"
																		 xmlns="http://www.w3.org/2000/svg">
																		<g filter="url(#filter0_d_2001_7)">
																				<path
																						d="M100.25 5.67062L158.687 39.4095C165.958 43.6074 170.437 51.3654 170.437 59.7611V127.239C170.437 135.635 165.958 143.393 158.687 147.59L100.25 181.329C92.9791 185.527 84.0209 185.527 76.75 181.329L18.3125 147.59C11.0416 143.393 6.56252 135.635 6.56252 127.239V59.7611C6.56252 51.3654 11.0416 43.6074 18.3125 39.4095L76.75 5.67062C84.0209 1.47275 92.9791 1.47275 100.25 5.67062Z"
																						stroke="#b277d3" stroke-width="5" shape-rendering="crispEdges"/>
																		</g>
																</svg>
																<p className='absolute z-30 flex justify-center w-full px-3 top-1/2 transform
																-translate-y-1/2 text-sm md:text-base text-pj-white text-center'
																>
																		Digital Solutions
																</p>
														</div>
														
														<div
																onClick={() => setSlideUpData(data[9])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer grid place-items-center ${showing !== 'digital' ? '-translate-x-8 invisible' : 'visible translate-x-1'}
																 hover:scale-95	transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		SEO Services
																</p>
														</div>
												</div>
												<div className='grid grid-flow-col col-span-2 w-fit -mt-5 gap-2'>
														<div
																onClick={() => setSlideUpData(data[10])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer ${showing !== 'digital' ? 'translate-x-8 ' +
																		'-translate-y-8 invisible' : 'visible -translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p
																		className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																		-translate-y-1/2 text-sm md:text-base text-pj-white px-2'
																>
																		Cloud Integration
																</p>
														</div>
														
														<div
																onClick={() => setSlideUpData(data[11])}
																className={`relative z-50 w-24 md:w-28 cursor-pointer ${showing !== 'digital' ? '-translate-x-8 ' +
																		'-translate-y-8 invisible' : 'visible translate-x-2.5'} hover:scale-95 transition ease-in-out duration-500`}
														>
																<img className="w-full z-20" src={hexagon2} alt=""/>
																<p className='absolute z-30 flex justify-center w-full top-1/2 transform text-center
																				-translate-y-1/2 text-sm md:text-base text-pj-white leading-tight'
																>
																		ERP Systems
																</p>
														</div>
												</div>
										</div>
								</div>
						</div>
						
						<LiveBGMain itemNumber={5}/>
						
						<div className={`${slideUpData === null && 'invisible'} w-full h-full absolute bottom-0 z-50`}>
								<div className={`w-full h-full relative `}>
										<div
												className={`w-full h-full bg-pj-light-Dark opacity-80 absolute z-10`}
												onClick={() => {
														setSlideUpData(null)
												}}
										></div>
										<div
												className={`${slideUpData === null && 'h-0' || 'h-[80%] lg:h-4/5'} w-full bg-pj-accent absolute bottom-0 z-50 transition-all duration-800 overflow-x-hidden overflow-y-scroll scrollbar`}>
												<div className={`relative w-full h-full bottom-0 px-2`}>
														<div
																className={`grid place-items-center h-16 border-b border-pj-secondary sticky top-0 bg-pj-accent`}>
																<p className={`text-lg sm:text-xl md:text-3xl text-white`}>
																		{slideUpData !== null ? slideUpData.title : ''}
																</p>
																<div
																		className={`absolute w-6 fill-pj-primary top-0 right-0 mt-4 mr-4 z-50 cursor-pointer
																				hover:scale-[1.05] hover:fill-pj-secondary transition-all duration-800`}
																		onClick={() => {
																				setSlideUpData(null)
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
																className={`flex flex-wrap justify-center items-center text-center p-5 lg:py-10`}
														>
																<div className="w-full lg:w-1/2 text-pj-white px-3 md:px-6">
																		<div
																				className="text-xl md:text-3xl  text-pj-secondary font-semibold py-3 flex items-center justify-center">
																				{slideUpData !== null ? slideUpData.subTitle : ''}
																		</div>
																		<p className="">
																				{slideUpData !== null ? slideUpData.description : ''}
																		</p>
																		<h4 className="pr-2 mt-5 text-sm md:text-base text-center">Technologies We Use</h4>
																		<ul className="flex gap-2 mt-2 mb-5 px-2 justify-center items-center flex-wrap">
																				{
																						slideUpData !== null && slideUpData.techStack.map(stack => {
																								return (
																										<li className="px-3 py-1 rounded-full text-xs md:text-sm bg-pj-secondary text-pj-accent">{stack}</li>
																								)
																						})
																				}
																		</ul>
																</div>
																<div
																		className={`w-full lg:py-15 lg:w-1/2 border-t-2 lg:border-t-0 lg:border-l-2 border-pj-secondary`}>
																		<img
																				className={`h-2/4 md:w-auto md:h-3/4 md:px-6 py-6 mx-auto`}
																				src={slideUpData !== null ? slideUpData.image : ''} alt=""/>
																</div>
														</div>
												</div>
										</div>
								</div>
						</div>
				</Layout>
		)
}

export default Services;