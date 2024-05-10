const IconDelete = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}

	if (typeof height === "undefined") {
		height = 20;
	}
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={width}
			height={height}
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='lucide lucide-trash-2'>
			<path d='M3 6h18' />
			<path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
			<path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
			<line
				x1='10'
				x2='10'
				y1='11'
				y2='17'
			/>
			<line
				x1='14'
				x2='14'
				y1='11'
				y2='17'
			/>
		</svg>
	);
};

const IconLoading = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}

	if (typeof height === "undefined") {
		height = 20;
	}
	return (
		<svg
			width={width}
			height={height}
			viewBox='0 0 24 24'
			xmlns='http://www.w3.org/2000/svg'>
			<g
				fill='none'
				stroke='currentColor'
				strokeLinecap='round'
				strokeWidth='2'>
				<path
					strokeDasharray='60'
					strokeDashoffset='60'
					strokeOpacity='.3'
					d='M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z'>
					<animate
						fill='freeze'
						attributeName='stroke-dashoffset'
						dur='1.3s'
						values='60;0'
					/>
				</path>
				<path
					strokeDasharray='15'
					strokeDashoffset='15'
					d='M12 3C16.9706 3 21 7.02944 21 12'>
					<animate
						fill='freeze'
						attributeName='stroke-dashoffset'
						dur='0.3s'
						values='15;0'
					/>
					<animateTransform
						attributeName='transform'
						dur='1.5s'
						repeatCount='indefinite'
						type='rotate'
						values='0 12 12;360 12 12'
					/>
				</path>
			</g>
		</svg>
	);
};

const IconBoxOpen = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width={`${width}px`}
			height={`${height}px`}
			x='0px'
			y='0px'
			viewBox='0 0 122.88 117.85'>
			<g>
				<path d='M60.05,68.41L18.02,46.33L6.2,60.47c14.91,7.88,29.82,15.76,44.74,23.65L60.05,68.41L60.05,68.41z M63.3,23.47L21.12,44.39 L62.24,66l41.2-21.65L79.81,31.99L63.3,23.47L63.3,23.47z M15.89,43.95L0.39,29.27c-0.57-0.65-0.51-1.65,0.15-2.23 c0.09-0.08,0.2-0.15,0.3-0.21L47.95,0.18c0.75-0.4,1.68-0.12,2.1,0.61l13.23,18.22L72.1,2.49c0.41-0.77,1.36-1.07,2.13-0.66 l47.8,25.27c0.14,0.08,0.27,0.17,0.39,0.29c0.61,0.62,0.6,1.62-0.02,2.23l-14.16,13.91l13.71,16.41c0.56,0.67,0.47,1.67-0.2,2.22 c-0.1,0.08-0.21,0.15-0.32,0.21l-12.31,6.51v24.4c0,0.66-0.4,1.22-0.98,1.46l-44.51,22.59c-0.29,0.32-0.71,0.52-1.17,0.52 c-0.62,0-1.15-0.35-1.41-0.87l-44.59-22.3c-0.55-0.28-0.87-0.83-0.87-1.41L15.59,69L3.05,62.37c-0.11-0.06-0.22-0.13-0.32-0.21 c-0.67-0.56-0.76-1.56-0.2-2.22L15.89,43.95L15.89,43.95z M60.84,21.06L48.11,3.67L4.07,28.7L18.46,42.1L60.84,21.06L60.84,21.06z M65.75,21.08l14.75,7.72l25.08,12.93l13.07-12.84L74.15,5.35L65.75,21.08L65.75,21.08z M106.47,46.33L64.44,68.41l9.11,15.7 l44.74-23.65L106.47,46.33L106.47,46.33z' />
			</g>
		</svg>
	);
};

const IconDashboard = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}
	return (
		<svg
			className='fill-current'
			width={`${width}px`}
			height={`${height}px`}
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
	);
};

const IconAnalytics = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}
	return (
		<svg
			width={`${width}px`}
			height={`${height}px`}
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
	);
};

const IconOrder = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}
	return (
		<svg
			width={`${width}px`}
			height={`${height}px`}
			viewBox='0 0 2048 2048'
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			className='fill-current'>
			<path
				fill='currentColor'
				d='m2029 1453l-557 558l-269-270l90-90l179 178l467-466zM1024 640H640V512h384zm0 256H640V768h384zm-384 128h384v128H640zM512 640H384V512h128zm0 256H384V768h128zm-128 128h128v128H384zm768-384V128H256v1792h896v128H128V0h1115l549 549v731l-128 128V640zm128-128h293l-293-293z'
			/>
		</svg>
	);
};

const IconMenu = (props: any) => {
	let { width, height } = props;
	if (typeof width === "undefined") {
		width = 20;
	}
	return (
		<svg
			width={`${width}px`}
			height={`${height}px`}
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
	);
};

export {
	IconDelete,
	IconLoading,
	IconBoxOpen,
	IconDashboard,
	IconAnalytics,
	IconOrder,
	IconMenu,
};
