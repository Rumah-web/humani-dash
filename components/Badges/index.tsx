const Badge = (props: { label: string; state?: string }) => {
	const { label, state } = props;
	return (
		<>
			{(!state || state === "") && (
				<span className='bg-primary text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-primary dark:text-white flex items-center space-x-1'>
					<span className='capitalize'>{label}</span>
				</span>
			)}

			{state === "default" && (
				<span className='bg-primary text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-primary dark:text-white flex items-center space-x-1'>
					<span className='capitalize'>{label}</span>
				</span>
			)}

			{state === "danger" && (
				<span className='bg-danger text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-danger dark:text-white flex items-center space-x-1'>
					<span className='capitalize'>{label}</span>
				</span>
			)}

			{state === "success" && (
				<span className='bg-success text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-success dark:text-white flex items-center space-x-1'>
					<span className='capitalize'>{label}</span>
				</span>
			)}

			{state === "warning" && (
				<span className='bg-warning text-white text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-warning dark:text-white flex items-center space-x-1'>
					<span className='capitalize'>{label}</span>
				</span>
			)}
		</>
	);
};

export default Badge;
