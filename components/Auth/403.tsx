import { FC } from "react";
import { Icon403 } from "../Icons";

const Page403: FC<{}> = () => {
	return (
		<div className="flex flex-col items-center justify-center py-8">
			<Icon403 className={'w-96'} />
			<div className='flex flex-col items-center gap-4'>
				<h1 className='text-3xl font-medium text-center'>
					You are not authorized
				</h1>
				<p className='text-xl text-center '>
					You tried to access a page you did not have prior authorization for.
				</p>
			</div>
		</div>
	);
};

export default Page403;
