"use client";

import { usePathname } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Loader from "../common/Loader";
import Sidebar from "../Sidebar";
import Header from "../Header";
import { PageContext } from "@/app/context";
import { ISession } from "@/app/type";

const Content: FC<{
	children: React.ReactNode;
	params: {
		session: ISession;
	};
}> = (props) => {
	const { children, params } = props;

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [loading, setLoading] = useState<boolean>(true);
	const pathname = usePathname();
	const condition = pathname === "/auth/signin";

    const pageParams = {
        session: params.session as ISession
    } as any


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
									session={props.params.session}
								/>
								{/* <!-- ===== Sidebar End ===== --> */}

								{/* <!-- ===== Content Area Start ===== --> */}
								<div className='relative flex flex-1 flex-col overflow-y-hidden overflow-x-hidden'>
									{/* <!-- ===== Header Start ===== --> */}
									<Header
										sidebarOpen={sidebarOpen}
										setSidebarOpen={setSidebarOpen}
										session={props.params.session}
									/>
									{/* <!-- ===== Header End ===== --> */}

									{/* <!-- ===== Main Content Start ===== --> */}
									<main>
										<div className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 overflow-y-auto h-screen'>
											<PageContext.Provider value={pageParams}>{children}</PageContext.Provider>
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
