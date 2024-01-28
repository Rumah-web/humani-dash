"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Loading from "../Table/Loading";
import NoImage from "../Placeholder/NoImage";

const Profile = () => {
	const [userData, setUserData] = useState(null as any);

	const getSession = async () => {
		const req = await fetch("/users/api/session", {
			method: "POST",
			body: JSON.stringify({}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { session } = await req.json();
			return session;
		}
	};

	useEffect(() => {
		(async () => {
			const session = await getSession();
			setUserData(session);
		})();
	}, []);

	return (
		<>
			{!userData ? (
				<>
					<Loading />
				</>
			) : (
				<>
					<span className='hidden text-right lg:block'>
						<span className='block text-sm font-medium text-black dark:text-white'>
							{userData.user.name}
						</span>
					</span>

					
						{userData.user.image ? (
							<>
                                <span className='h-12 w-12 rounded-full'>
                                    <Image
                                        width={112}
                                        height={112}
                                        src={`/${userData.user.image}`}
                                        alt='User'/>
                                </span>
                            </>
						) : (
							<>
                                <div className="h-12 w-12 bg-gray rounded-full"></div>
                            </>
						)}
					
				</>
			)}
		</>
	);
};

export default Profile;
