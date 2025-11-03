"use client";
import { ReactElement } from "react";
import LayoutOutline from "@/app/_LayoutOutline";
import Link from "next/link";
import StatCardRow from "@/Components/StatCardRow";

const About = (): ReactElement => {
    return (
        <LayoutOutline title={"About"} description={"Get to know us a little"} backLink={"/"} lgLogoShow={false}>
            {/* Make this the positioning context + leave room for the cards */}
            <div className="relative overflow-visible pb-44 md:pb-56">

                {/* Content block sits above background but below the cards */}
                <div className="text-justify relative z-40">
                    <p className="text-sm md:text-lg lg:text-xl px-5 md:px-20 lg:px-80 sm:mt-5 lg:mt-10 text-pj-white">
                        Founded in Bishoftu, Ethiopia, Doxa Innovative Software Development PLC is a full-scale digital studio built to help businesses craft standout brands and scalable digital experiences. We specialize in tailoring smart, elegant solutions—from bold brand identities to efficient web and mobile platforms—so companies can confidently present their vision and connect with customers.
                        <br />
                        <br />
                        At Doxa, we believe in teamwork, clarity, and measurable impact. Our team is made up of skilled designers, developers and strategists who are passionate about bringing local businesses to global standards. We serve clients across industries—technology, education, hospitality, non-profit and beyond—and help them grow through thoughtful design and purposeful technology.
                        <br />
                        <br />
                        Our mission is simple: help businesses do more, serve better, and reach farther.
                        <br />
                        <br />
                        Ready to start your journey? Contact us and let’s build something meaningful together.

                    </p>

                    <h3 className="my-6 lg:my-12 text-pj-white font-bold text-center text-xl md:text-3xl">
                        We want to work with you,
                        <Link href={"/contact"} className="underline text-pj-primary">Contact Us</Link>
                    </h3>
                </div>

                {/* Cards: pinned, perfectly centered, above everything */}
                <div className="relative left-1/2 mt-24 -translate-x-1/2 bottom-6 md:bottom-10 z-[60]">
                    <StatCardRow />
                </div>
            </div>
        </LayoutOutline>
    );
};
export default About;
