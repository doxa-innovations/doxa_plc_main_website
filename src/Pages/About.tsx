import {ReactElement} from "react";
import Layout from "../Components/Layout.tsx";
import {Link} from "react-router-dom";
import {LiveBGMain} from "../Components/LiveBG.tsx";

const About = (): ReactElement => {
		return (
				<Layout title={'About'} description={'Get to know us a little'} backLink={'/'} lgLogoShow={false}>
						<div className={`text-justify mt-16 lg:mt-20 md:px-14 lg:px-20 relative z-50`}>
								<p className=" md:text-lg lg:text-xl font-thin px-5 md:px-80 sm:mt-5 lg:mt-10 text-pj-white ">
										Doxa Innovative Software Development PLC is an online creative hub dedicated to helping businesses
										establish a strong and professional brand identity at an affordable price. With a focus on enhancing
										how businesses present themselves to their clients, the studio provides branding solutions that help
										companies stand out and effectively communicate their vision.
										<br/>
										<br/>
										Based in Addis Ababa or Bishoftu, Ethiopia, Doxa Innovative primarily serves local businesses in
										the area. The team is composed of passionate, skilled professionals committed to empowering
										businesses to grow and reach more customers. Their mission is to deliver high-quality, visually
										appealing designs that reflect each client’s unique identity while fostering trust and engagement
										with their audience.
								</p>
								
								<h3 className="my-6 lg:my-12 text-pj-white font-bold text-center text-xl md:text-3xl">
										We want to work with you, <br/>
										<Link to={'/contact'} className="underline text-pj-primary">Contact Us</Link>
								</h3>
						</div>
						
						<LiveBGMain itemNumber={4}/>
				</Layout>
		)
}
export default About;