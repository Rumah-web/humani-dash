import { BRAND } from "@/types/brand";
import Image from "next/image";

const brandData: BRAND[] = [
	{
		logo: "/images/brand/brand-01.svg",
		name: "Google",
		orders: 3.5,
		orders_finish: 3,
    revenues: "5,768 K",
		conversion: 4.8,
	},
	{
		logo: "/images/brand/brand-06.svg",
		name: "Instagram",
		orders: 1.5,
		orders_finish: 1.2,
		revenues: "3,580 K",
		conversion: 2.5,
	},
	{
		logo: "/images/brand/brand-05.svg",
		name: "Facebook",
		orders: 3.5,
		orders_finish: 2.5,
		revenues: "6,768 K",
		conversion: 4.2,
	},
	{
		logo: "/images/brand/brand-07.svg",
		name: "Affiliate",
		orders: 3.5,
		orders_finish: 3.5,
		revenues: "12,768 K",
		conversion: 9.2,
	},
];

const TableOne = () => {
	return (
		<div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
			<h4 className='mb-6 text-xl font-semibold text-black dark:text-white'>
				Top Channels
			</h4>

			<div className='flex flex-col'>
				<div className='grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5'>
					<div className='p-2.5 xl:p-5'>
						<h5 className='text-sm font-medium uppercase xsm:text-base'>
							Source
						</h5>
					</div>
					<div className='p-2.5 text-center xl:p-5'>
						<h5 className='text-sm font-medium uppercase xsm:text-base'>
							Orders
						</h5>
					</div>
					<div className='hidden p-2.5 text-center sm:block xl:p-5'>
						<h5 className='text-sm font-medium uppercase xsm:text-base'>
							Finish Orders
						</h5>
					</div>
					<div className='p-2.5 text-center xl:p-5'>
						<h5 className='text-sm font-medium uppercase xsm:text-base'>
							Revenues
						</h5>
					</div>
					<div className='hidden p-2.5 text-center sm:block xl:p-5'>
						<h5 className='text-sm font-medium uppercase xsm:text-base'>
							Conversion
						</h5>
					</div>
				</div>

				{brandData.map((brand, key) => (
					<div
						className={`grid grid-cols-3 sm:grid-cols-5 ${
							key === brandData.length - 1
								? ""
								: "border-b border-stroke dark:border-strokedark"
						}`}
						key={key}>
						<div className='flex items-center gap-3 p-2.5 xl:p-5'>
							<div className='flex-shrink-0'>
								<Image
									src={brand.logo}
									alt='Brand'
									width={48}
									height={48}
								/>
							</div>
							<p className='hidden text-black dark:text-white sm:block'>
								{brand.name}
							</p>
						</div>

						<div className='flex items-center justify-center p-2.5 xl:p-5'>
							<p className='text-black dark:text-white'>{brand.orders}K</p>
						</div>

						<div className='hidden items-center justify-center p-2.5 sm:flex xl:p-5'>
							<p className='text-black dark:text-white'>{brand.orders_finish}</p>
						</div>

            <div className='flex items-center justify-center p-2.5 xl:p-5'>
							<p className='text-meta-3'>Rp. {brand.revenues}</p>
						</div>

						<div className='hidden items-center justify-center p-2.5 sm:flex xl:p-5'>
							<p className='text-meta-5'>{brand.conversion}%</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default TableOne;
