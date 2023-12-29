"use client"
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "@/app/components/aiu/scaffold-eth";
import { useOutsideClick } from "@/app/hooks/aiu/scaffold-eth";

type HeaderMenuLink = {
    label: string;
    href: string;
    icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
    {
        label: "Home",
        href: "/",
    },
];

export const HeaderMenuLinks = () => {
    const router = useRouter();

    return (
        <>
            {menuLinks.map(({ label, href, icon }) => {
                const isActive = router.pathname === href;
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            passHref
                            className={`${isActive ? "bg-secondary shadow-md" : ""
                                } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
                        >
                            {icon}
                            <span>{label}</span>
                        </Link>
                    </li>
                );
            })}
        </>
    );
};

/**
 * Site header
 */
export const Header = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const burgerMenuRef = useRef<HTMLDivElement>(null);
    useOutsideClick(
        burgerMenuRef,
        useCallback(() => setIsDrawerOpen(false), []),
    );

    return (
        <div className="sticky spaceship-display-screen max-w-[100%] sm:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
            <div className="navbar-start w-auto lg:w-1/2 top-0">

                <Link href="https://ai-universe.io" passHref className="lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
                    <div className="flex relative w-44 h-10">
                        <Image alt="SE2 logo" className="cursor-pointer" fill src="/ai-universe-logo-white.svg" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold leading-tight">Warp Drive</span>
                        <span className="text-xs">An Infinite Adventure</span>
                    </div>
                </Link>
                <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
                </ul>
            </div>
            <div className="navbar-end flex-grow mr-4">
                <RainbowKitCustomConnectButton />
            </div>
        </div>
    );
};
