"use client";

import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Loader from "../common/Loader";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Content: FC<{ session: any; children: React.ReactNode }> = (props) => {
	const { children, session } = props;

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [loading, setLoading] = useState<boolean>(true);
	const pathname = usePathname();
	const condition = pathname === "/auth/signin";

	useEffect(() => {
		setTimeout(() => setLoading(false), 1000);
	}, []);

	return (
		<>
			<div className='dark:bg-boxdark-2 dark:text-bodydark'>
				{loading ? (
					<Loader />
				) : (
					<div className='flex h-screen overflow-hidden'>
						{!condition ? (
							<>
								{/* <!-- ===== Sidebar Start ===== --> */}
								<Sidebar
									sidebarOpen={sidebarOpen}
									setSidebarOpen={setSidebarOpen}
								/>
								{/* <!-- ===== Sidebar End ===== --> */}

								{/* <!-- ===== Content Area Start ===== --> */}
								<div className='relative flex flex-1 flex-col overflow-y-hidden overflow-x-hidden'>
									{/* <!-- ===== Header Start ===== --> */}
									<Header
										sidebarOpen={sidebarOpen}
										setSidebarOpen={setSidebarOpen}
									/>
									{/* <!-- ===== Header End ===== --> */}

									{/* <!-- ===== Main Content Start ===== --> */}
									<main>
										<div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 overflow-y-auto h-screen'>
											{children}
										</div>
									</main>
									{/* <!-- ===== Main Content End ===== --> */}
								</div>
								{/* <!-- ===== Content Area End ===== --> */}
							</>
						) : (
							<>
								{/* <!-- ===== Main Content Start ===== --> */}
								<main className='w-full'>
									<div className='flex w-full'>{children}</div>
								</main>
								{/* <!-- ===== Main Content End ===== --> */}
							</>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default Content;
