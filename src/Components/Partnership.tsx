"use client";
import Link from "next/link";
import { useMemo } from "react";


type Partner = {
    name: string;
    href: string;
    logo: string;
    width?: number;
    height?: number;
};

const PARTNERS: Partner[] = [
    { name: "Maor Lutheran Theological Seminary", href: "https://mlts.lcechurch.org", logo: "https://cdn.doxaplc.com/doxa-public/maor.png" },
    { name: "ZOA International", href: "https://www.zoa-international.com/", logo: "https://cdn.doxaplc.com/doxa-public/ZOA.svg" },
    { name: "Zoe Delivery", href: "https://zoedelivery.com", logo: "https://cdn.doxaplc.com/doxa-public/Zoe.png" },
    { name: "Classic Noodle & Burger House", href: "https://classicnoodle.com", logo: "https://cdn.doxaplc.com/doxa-public/classic_logo.png" },
    { name: "MySeed", href: "https://myseed.et/", logo: "https://cdn.doxaplc.com/doxa-public/myseed.png" },
    { name: "KLA Constructions LLP", href: "https://klaconstructionequipment.com", logo: "https://cdn.doxaplc.com/doxa-public/kla.svg" },
    { name: "Maor Lutheran Theological Seminary", href: "https://mlts.lcechurch.org", logo: "https://cdn.doxaplc.com/doxa-public/maor.png" },
    { name: "ZOA International", href: "https://www.zoa-international.com/", logo: "https://cdn.doxaplc.com/doxa-public/ZOA.svg" },
    { name: "Zoe Delivery", href: "https://zoedelivery.com", logo: "https://cdn.doxaplc.com/doxa-public/Zoe.png" },
    { name: "Classic Noodle & Burger House", href: "https://classicnoodle.com", logo: "https://cdn.doxaplc.com/doxa-public/classic_logo.png" },
    { name: "MySeed", href: "https://myseed.et/", logo: "https://cdn.doxaplc.com/doxa-public/myseed.png" },
    { name: "KLA Constructions LLP", href: "https://klaconstructionequipment.com", logo: "https://cdn.doxaplc.com/doxa-public/kla.svg" },
    { name: "Maor Lutheran Theological Seminary", href: "https://mlts.lcechurch.org", logo: "https://cdn.doxaplc.com/doxa-public/maor.png" },
    { name: "ZOA International", href: "https://www.zoa-international.com/", logo: "https://cdn.doxaplc.com/doxa-public/ZOA.svg" },
    { name: "Zoe Delivery", href: "https://zoedelivery.com", logo: "https://cdn.doxaplc.com/doxa-public/Zoe.png" },
    { name: "Classic Noodle & Burger House", href: "https://classicnoodle.com", logo: "https://cdn.doxaplc.com/doxa-public/classic_logo.png" },
    { name: "MySeed", href: "https://myseed.et/", logo: "https://cdn.doxaplc.com/doxa-public/myseed.png" },
    { name: "KLA Constructions LLP", href: "https://klaconstructionequipment.com", logo: "https://cdn.doxaplc.com/doxa-public/kla.svg" },
    { name: "Maor Lutheran Theological Seminary", href: "https://mlts.lcechurch.org", logo: "https://cdn.doxaplc.com/doxa-public/maor.png" },
    { name: "ZOA International", href: "https://www.zoa-international.com/", logo: "https://cdn.doxaplc.com/doxa-public/ZOA.svg" },
    { name: "Zoe Delivery", href: "https://zoedelivery.com", logo: "https://cdn.doxaplc.com/doxa-public/Zoe.png" },
    { name: "Classic Noodle & Burger House", href: "https://classicnoodle.com", logo: "https://cdn.doxaplc.com/doxa-public/classic_logo.png" },
    { name: "MySeed", href: "https://myseed.et/", logo: "https://cdn.doxaplc.com/doxa-public/myseed.png" },
    { name: "KLA Constructions LLP", href: "https://klaconstructionequipment.com", logo: "https://cdn.doxaplc.com/doxa-public/kla.svg" },
];


export default function PartnerStrip() {
    const scrollingList = useMemo(() => [...PARTNERS, ...PARTNERS], []);

    return (
        <section aria-label="Partner companies" className="absolute bottom-24 md:bottom-10 w-full md:mt-12 z-50">
            <div className="mx-auto px-4 text-center">
                <div className="flex items-center justify-center">
                    <h2 className="text-[11px] sm:text-xs md:text-sm font-medium tracking-wider uppercase text-pj-primary">
                        Trusted by
                    </h2>
                </div>

                {/* Transparent container */}
                <div className="group relative mt-3 overflow-hidden">
                    <div className="mask-fade">
                        <div className="flex animate-[marquee_10s_linear_infinite] md:animate-[marquee_22s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none duration-700">
                            {scrollingList.map((p, idx) => (
                                <Link
                                    href={p.href}
                                    key={`${p.name}-${idx}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex min-w-[70px] sm:min-w-[160px] md:min-w-[180px] items-center justify-center px-4 sm:px-5 md:px-6 py-3 sm:py-4 md:py-5 opacity-80 hover:opacity-100 transition"
                                    aria-label={p.name}
                                >
                                    <img
                                        src={p.logo}
                                        alt={p.name}
                                        className="h-10 md:h-12 w-auto object-contain"
                                        sizes="(max-width:640px) 100px, (max-width:768px) 120px, 140px"
                                    />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .mask-fade {
                    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
            `}</style>
        </section>
    );
}
