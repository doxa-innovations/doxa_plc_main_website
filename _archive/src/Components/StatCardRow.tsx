"use client";

import StatCard from "./StatCard";

export default function StatCardRow() {
    return (
        <div className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            <StatCard
                title="Projects Completed"
                value={12}
                description="Delivered tailored web, mobile, and brand solutions across tech, education, hospitality, and e-commerce."
                href="/works"
            />

            <StatCard
                title="Active Clients"
                value={6}
                description="Serving partners in Ethiopia and the U.S. — providing continuous support and long-term digital strategy."
                href="/works"
            />

            <StatCard
                title="Team Members"
                value={7}
                description="A multidisciplinary team of designers, developers, and strategists crafting digital excellence from Bishoftu."
                href="/team"
            />
        </div>
    );
}
