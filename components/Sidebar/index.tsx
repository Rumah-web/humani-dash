import React, { act, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconAnalytics, IconDashboard, IconMenu, IconOrder } from "../Icons";
import Menu from "./Menu";
import { IMenu } from "@/types/menu";
import { ISession } from "@/app/type";

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (arg: boolean) => void;
	session: ISession;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen, session }: SidebarProps) => {
	const trigger = useRef<any>(null);
	const sidebar = useRef<any>(null);

	const check = (permission: string[]) => {
		let authorized = false;
		for (let item of permission) {
			if (session?.user.roles?.includes(item)) {
				authorized = true;
				break;
			}
		}

		return authorized;
	};

	const menus = [
		{ label: "Dashboard", icon: <IconDashboard />, url: "/" },
		{ label: "Analytics", icon: <IconAnalytics />, url: "/chart" },
		{
			label: "Manage Order",
			icon: <IconOrder />,
			url: "#",
			permission: check(["admin"]),
			items: [
				{
					label: "Order",
					url: "/order",
					permission: check(["admin"]),
				},
				{ label: "Invoice", url: "/invoice", permission: check(["admin"]) },
			],
		},
		{
			label: "Manage Menu",
			icon: <IconMenu />,
			permission: check(["admin"]),
			url: "#",
			items: [
				{
					label: "Category",
					url: "/menu-category",
					permission: check(["admin"]),
				},
				{ label: "Menu", url: "/menu", permission: check(["admin"]) },
				{ label: "Item", url: "/menu-item", permission: check(["admin"]) },
			],
		},
	] as IMenu[];

	const others = [
		{ label: "Media", icon: <IconDashboard />, url: "/media" },
		{
			label: "Users",
			icon: <IconAnalytics />,
			url: "/users",
			permission: check(["admin"]),
		},
	] as IMenu[];

	// close on click outside
	useEffect(() => {
		const clickHandler = ({ target }: MouseEvent) => {
			if (!sidebar.current || !trigger.current) return;
			if (
				!sidebarOpen ||
				sidebar.current.contains(target) ||
				trigger.current.contains(target)
			)
				return;
			setSidebarOpen(false);
		};
		document.addEventListener("click", clickHandler);
		return () => document.removeEventListener("click", clickHandler);
	});

	return (
		<aside
			ref={sidebar}
			className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
				sidebarOpen ? "translate-x-0" : "-translate-x-full"
			}`}>
			{/* <!-- SIDEBAR HEADER --> */}
			<div className='flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5'>
				<Link
					href='/'
					className='flex flex-col items-center w-full'>
					<Image
						width={70}
						height={32}
						src={"/logo-white.png"}
						alt='Logo'
					/>
				</Link>

				<button
					ref={trigger}
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-controls='sidebar'
					aria-expanded={sidebarOpen}
					className='block lg:hidden'>
					<svg
						className='fill-current'
						width='20'
						height='18'
						viewBox='0 0 20 18'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z'
							fill=''
						/>
					</svg>
				</button>
			</div>
			{/* <!-- SIDEBAR HEADER --> */}

			<div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
				{/* <!-- Sidebar Menu --> */}
				<nav className='mt-5 py-0 px-4 mt-0 lg:px-6'>
					{/* <!-- Menu Group --> */}
					<div>
						<Menu
							menus={menus}
							sidebarOpen={sidebarOpen}
							setSidebarOpen={setSidebarOpen}
							menuLabel={"menu"}
						/>
					</div>

					{/* <!-- Others Group --> */}
					<div>
						<Menu
							menus={others}
							sidebarOpen={sidebarOpen}
							setSidebarOpen={setSidebarOpen}
							menuLabel={"Others"}
						/>
					</div>
				</nav>
				{/* <!-- Sidebar Menu --> */}
			</div>
		</aside>
	);
};

export default Sidebar;
