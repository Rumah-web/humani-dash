import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import Image from "next/image";

interface SidebarProps {
	sidebarOpen: boolean;
	setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
	const pathname = usePathname();

	const trigger = useRef<any>(null);
	const sidebar = useRef<any>(null);

	let storedSidebarExpanded = "true";
	const [sidebarExpanded, setSidebarExpanded] = useState(
		storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
	);

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

	// close if the esc key is pressed
	useEffect(() => {
		const keyHandler = ({ key }: KeyboardEvent) => {
			if (!sidebarOpen || key !== "Escape") return;
			setSidebarOpen(false);
		};
		document.addEventListener("keydown", keyHandler);
		return () => document.removeEventListener("keydown", keyHandler);
	});

	useEffect(() => {
		localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
		if (sidebarExpanded) {
			document.querySelector("body")?.classList.add("sidebar-expanded");
		} else {
			document.querySelector("body")?.classList.remove("sidebar-expanded");
		}
	}, [sidebarExpanded]);

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
						<h3 className='mb-4 ml-4 text-sm font-semibold text-bodydark2'>
							MENU
						</h3>

						<ul className='mb-6 flex flex-col gap-1.5'>
							{/* <!-- Menu Item Dashboard --> */}
							<SidebarLinkGroup
								activeCondition={
									pathname === "/" || pathname.includes("dashboard")
								}>
								{(handleClick, open) => {
									return (
										<React.Fragment>
											<Link
												href='/'
												className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
													pathname === "/" && "bg-graydark dark:bg-meta-4"
												}`}>
												<svg
													className='fill-current'
													width='18'
													height='18'
													viewBox='0 0 18 18'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														d='M6.10322 0.956299H2.53135C1.5751 0.956299 0.787598 1.7438 0.787598 2.70005V6.27192C0.787598 7.22817 1.5751 8.01567 2.53135 8.01567H6.10322C7.05947 8.01567 7.84697 7.22817 7.84697 6.27192V2.72817C7.8751 1.7438 7.0876 0.956299 6.10322 0.956299ZM6.60947 6.30005C6.60947 6.5813 6.38447 6.8063 6.10322 6.8063H2.53135C2.2501 6.8063 2.0251 6.5813 2.0251 6.30005V2.72817C2.0251 2.44692 2.2501 2.22192 2.53135 2.22192H6.10322C6.38447 2.22192 6.60947 2.44692 6.60947 2.72817V6.30005Z'
														fill=''
													/>
													<path
														d='M15.4689 0.956299H11.8971C10.9408 0.956299 10.1533 1.7438 10.1533 2.70005V6.27192C10.1533 7.22817 10.9408 8.01567 11.8971 8.01567H15.4689C16.4252 8.01567 17.2127 7.22817 17.2127 6.27192V2.72817C17.2127 1.7438 16.4252 0.956299 15.4689 0.956299ZM15.9752 6.30005C15.9752 6.5813 15.7502 6.8063 15.4689 6.8063H11.8971C11.6158 6.8063 11.3908 6.5813 11.3908 6.30005V2.72817C11.3908 2.44692 11.6158 2.22192 11.8971 2.22192H15.4689C15.7502 2.22192 15.9752 2.44692 15.9752 2.72817V6.30005Z'
														fill=''
													/>
													<path
														d='M6.10322 9.92822H2.53135C1.5751 9.92822 0.787598 10.7157 0.787598 11.672V15.2438C0.787598 16.2001 1.5751 16.9876 2.53135 16.9876H6.10322C7.05947 16.9876 7.84697 16.2001 7.84697 15.2438V11.7001C7.8751 10.7157 7.0876 9.92822 6.10322 9.92822ZM6.60947 15.272C6.60947 15.5532 6.38447 15.7782 6.10322 15.7782H2.53135C2.2501 15.7782 2.0251 15.5532 2.0251 15.272V11.7001C2.0251 11.4188 2.2501 11.1938 2.53135 11.1938H6.10322C6.38447 11.1938 6.60947 11.4188 6.60947 11.7001V15.272Z'
														fill=''
													/>
													<path
														d='M15.4689 9.92822H11.8971C10.9408 9.92822 10.1533 10.7157 10.1533 11.672V15.2438C10.1533 16.2001 10.9408 16.9876 11.8971 16.9876H15.4689C16.4252 16.9876 17.2127 16.2001 17.2127 15.2438V11.7001C17.2127 10.7157 16.4252 9.92822 15.4689 9.92822ZM15.9752 15.272C15.9752 15.5532 15.7502 15.7782 15.4689 15.7782H11.8971C11.6158 15.7782 11.3908 15.5532 11.3908 15.272V11.7001C11.3908 11.4188 11.6158 11.1938 11.8971 11.1938H15.4689C15.7502 11.1938 15.9752 11.4188 15.9752 11.7001V15.272Z'
														fill=''
													/>
												</svg>
												Dashboard
											</Link>
										</React.Fragment>
									);
								}}
							</SidebarLinkGroup>
							{/* <!-- Menu Item Dashboard --> */}

							{/* <!-- Menu Item Analytics --> */}
							<li>
								<Link
									href='/chart'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes("chart") && "bg-graydark dark:bg-meta-4"
									}`}>
									<svg
										width='18'
										height='18'
										viewBox='0 0 32 32'
										xmlns='http://www.w3.org/2000/svg'
										className='fill-current'
										fill='none'>
										<path
											fill='currentColor'
											d='M4 2H2v26a2 2 0 0 0 2 2h26v-2H4Z'
										/>
										<path
											fill='currentColor'
											d='M30 9h-7v2h3.59L19 18.59l-4.29-4.3a1 1 0 0 0-1.42 0L6 21.59L7.41 23L14 16.41l4.29 4.3a1 1 0 0 0 1.42 0l8.29-8.3V16h2Z'
										/>
									</svg>
									Analytics
								</Link>
							</li>
							{/* <!-- Menu Item Analytics --> */}

							{/* <!-- Menu Manage Order --> */}
							<SidebarLinkGroup
								activeCondition={
									pathname === "/forms" || pathname.includes("forms")
								}>
								{(handleClick, open) => {
									return (
										<React.Fragment>
											<Link
												href='#'
												className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
													(pathname === "/forms" ||
														pathname.includes("forms")) &&
													"bg-graydark dark:bg-meta-4"
												}`}
												onClick={(e) => {
													e.preventDefault();
													sidebarExpanded
														? handleClick()
														: setSidebarExpanded(true);
												}}>
												<svg
													width='18'
													height='18'
													viewBox='0 0 2048 2048'
													xmlns='http://www.w3.org/2000/svg'
													fill='none'
													className='fill-current'>
													<path
														fill='currentColor'
														d='m2029 1453l-557 558l-269-270l90-90l179 178l467-466zM1024 640H640V512h384zm0 256H640V768h384zm-384 128h384v128H640zM512 640H384V512h128zm0 256H384V768h128zm-128 128h128v128H384zm768-384V128H256v1792h896v128H128V0h1115l549 549v731l-128 128V640zm128-128h293l-293-293z'
													/>
												</svg>
												Manage Order
												<svg
													className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
														open && "rotate-180"
													}`}
													width='20'
													height='20'
													viewBox='0 0 20 20'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														fillRule='evenodd'
														clipRule='evenodd'
														d='M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z'
														fill=''
													/>
												</svg>
											</Link>
											{/* <!-- Dropdown Menu Start --> */}
											<div
												className={`translate transform overflow-hidden ${
													!open && "hidden"
												}`}>
												<ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
													<li>
														<Link
															href='/forms/form-elements'
															className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																pathname === "/forms/form-elements" &&
																"text-white"
															}`}>
															Order
														</Link>
													</li>
													<li>
														<Link
															href='/forms/form-layout'
															className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																pathname === "/forms/form-layout" &&
																"text-white"
															}`}>
															Invoice
														</Link>
													</li>
												</ul>
											</div>
											{/* <!-- Dropdown Menu End --> */}
										</React.Fragment>
									);
								}}
							</SidebarLinkGroup>
							{/* <!-- Menu Manage Order --> */}

							{/* <!-- Menu Manage Menu --> */}
							<SidebarLinkGroup
								activeCondition={
									pathname === "/forms" || pathname.includes("forms")
								}>
								{(handleClick, open) => {
									return (
										<React.Fragment>
											<Link
												href='#'
												className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
													(pathname === "/forms" ||
														pathname.includes("forms")) &&
													"bg-graydark dark:bg-meta-4"
												}`}
												onClick={(e) => {
													e.preventDefault();
													sidebarExpanded
														? handleClick()
														: setSidebarExpanded(true);
												}}>
												<svg
													width='18'
													height='18'
													viewBox='0 0 14 14'
													xmlns='http://www.w3.org/2000/svg'
													className='fill-current'
													fill='none'>
													<path
														fill='none'
														stroke='currentColor'
														strokeLinecap='round'
														strokeLinejoin='round'
														d='M7 3h0a6.5 6.5 0 0 1 6.5 6.5v0a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v0A6.5 6.5 0 0 1 7 3Zm0 0V1.5m-6.5 11h13'
													/>
												</svg>
												Manage Menu
												<svg
													className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
														open && "rotate-180"
													}`}
													width='20'
													height='20'
													viewBox='0 0 20 20'
													fill='none'
													xmlns='http://www.w3.org/2000/svg'>
													<path
														fillRule='evenodd'
														clipRule='evenodd'
														d='M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z'
														fill=''
													/>
												</svg>
											</Link>
											{/* <!-- Dropdown Menu Start --> */}
											<div
												className={`translate transform overflow-hidden ${
													!open && "hidden"
												}`}>
												<ul className='mt-4 mb-5.5 flex flex-col gap-2.5 pl-6'>
													<li>
														<Link
															href='/menu-category'
															className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																pathname === "/menu-category" && "text-white"
															}`}>
															Category
														</Link>
													</li>
													<li>
														<Link
															href='/menu'
															className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																pathname === "/menu" && "text-white"
															}`}>
															Menu
														</Link>
													</li>
													<li>
														<Link
															href='/menu-item'
															className={`first-letter:group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${
																pathname === "/menu-item" && "text-white"
															}`}>
															Item
														</Link>
													</li>
												</ul>
											</div>
											{/* <!-- Dropdown Menu End --> */}
										</React.Fragment>
									);
								}}
							</SidebarLinkGroup>
							{/* <!-- Menu Manage Menu --> */}
						</ul>
					</div>

					{/* <!-- Others Group --> */}
					<div>
						<h3 className='mb-4 ml-4 text-sm font-semibold text-bodydark2'>
							OTHERS
						</h3>

						<ul className='mb-6 flex flex-col gap-1.5'>
							{/* <!-- Menu Item Media --> */}
							<li>
								<Link
									href='/media'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes("chart") && "bg-graydark dark:bg-meta-4"
									}`}>
									<svg
										width='23'
										height='23'
										viewBox='0 0 24 24'
										xmlns='http://www.w3.org/2000/svg'
										className='fill-current'
										fill='none'>
										<path
											fill='currentColor'
											d='M9.462 13h8.692l-2.758-3.654l-2.454 3.077l-1.588-1.885zm-5.847 6.77q-.67 0-1.143-.473Q2 18.825 2 18.154V7.077h1v11.077q0 .27.173.442t.442.173H19v1zm3-3q-.67 0-1.143-.473Q5 15.825 5 15.154V4.615q0-.67.472-1.143Q5.944 3 6.615 3h4.962l2 2h6.808q.67 0 1.143.472q.472.472.472 1.143v8.539q0 .671-.472 1.143t-1.143.472zm0-1h13.77q.269 0 .442-.174t.173-.442V6.615q0-.269-.173-.442T20.385 6h-7.21l-2-2h-4.56q-.269 0-.442.173T6 4.615v10.539q0 .27.173.442t.442.173m-.615 0V4z'
										/>
									</svg>
									Media
								</Link>
							</li>
							{/* <!-- Menu Item Media --> */}

							{/* <!-- Menu Item Users --> */}
							<li>
								<Link
									href='/users'
									className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
										pathname.includes("users") && "bg-graydark dark:bg-meta-4"
									}`}>
									<svg
										width='20'
										height='20'
										viewBox='0 0 36 36'
										xmlns='http://www.w3.org/2000/svg'
										className='fill-current'
										fill='none'>
										<path
											fill='currentColor'
											d='M17.9 17.3c2.7 0 4.8-2.2 4.8-4.9s-2.2-4.8-4.9-4.8S13 9.8 13 12.4c0 2.7 2.2 4.9 4.9 4.9m-.1-7.7c.1 0 .1 0 0 0c1.6 0 2.9 1.3 2.9 2.9s-1.3 2.8-2.9 2.8c-1.6 0-2.8-1.3-2.8-2.8c0-1.6 1.3-2.9 2.8-2.9'
											className='clr-i-outline clr-i-outline-path-1'
										/>
										<path
											fill='currentColor'
											d='M32.7 16.7c-1.9-1.7-4.4-2.6-7-2.5h-.8c-.2.8-.5 1.5-.9 2.1c.6-.1 1.1-.1 1.7-.1c1.9-.1 3.8.5 5.3 1.6V25h2v-8z'
											className='clr-i-outline clr-i-outline-path-2'
										/>
										<path
											fill='currentColor'
											d='M23.4 7.8c.5-1.2 1.9-1.8 3.2-1.3c1.2.5 1.8 1.9 1.3 3.2c-.4.9-1.3 1.5-2.2 1.5c-.2 0-.5 0-.7-.1c.1.5.1 1 .1 1.4v.6c.2 0 .4.1.6.1c2.5 0 4.5-2 4.5-4.4c0-2.5-2-4.5-4.4-4.5c-1.6 0-3 .8-3.8 2.2c.5.3 1 .7 1.4 1.3'
											className='clr-i-outline clr-i-outline-path-3'
										/>
										<path
											fill='currentColor'
											d='M12 16.4c-.4-.6-.7-1.3-.9-2.1h-.8c-2.6-.1-5.1.8-7 2.4L3 17v8h2v-7.2c1.6-1.1 3.4-1.7 5.3-1.6c.6 0 1.2.1 1.7.2'
											className='clr-i-outline clr-i-outline-path-4'
										/>
										<path
											fill='currentColor'
											d='M10.3 13.1c.2 0 .4 0 .6-.1v-.6c0-.5 0-1 .1-1.4c-.2.1-.5.1-.7.1c-1.3 0-2.4-1.1-2.4-2.4c0-1.3 1.1-2.4 2.4-2.4c1 0 1.9.6 2.3 1.5c.4-.5 1-1 1.5-1.4c-1.3-2.1-4-2.8-6.1-1.5c-2.1 1.3-2.8 4-1.5 6.1c.8 1.3 2.2 2.1 3.8 2.1'
											className='clr-i-outline clr-i-outline-path-5'
										/>
										<path
											fill='currentColor'
											d='m26.1 22.7l-.2-.3c-2-2.2-4.8-3.5-7.8-3.4c-3-.1-5.9 1.2-7.9 3.4l-.2.3v7.6c0 .9.7 1.7 1.7 1.7h12.8c.9 0 1.7-.8 1.7-1.7v-7.6zm-2 7.3H12v-6.6c1.6-1.6 3.8-2.4 6.1-2.4c2.2-.1 4.4.8 6 2.4z'
											className='clr-i-outline clr-i-outline-path-6'
										/>
										<path
											fill='none'
											d='M0 0h36v36H0z'
										/>
									</svg>
									Users
								</Link>
							</li>
							{/* <!-- Menu Item Users --> */}
						</ul>
					</div>
				</nav>
				{/* <!-- Sidebar Menu --> */}
			</div>
		</aside>
	);
};

export default Sidebar;
