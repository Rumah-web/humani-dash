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

const Icon403 = (props: any) => {
	return (
		<svg
			className={props.className}
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 500 500'>
			<g>
				<path
					fill='fill:#3B82F6'
					d='M55.48 273.73s2.32 72 62.43 120 143.41 51.43 210.84 56 119.23-33.62 127-91.32-43.72-74.64-71.68-140.33-25.43-87.28-84.58-127.68S147.8 74.81 99.29 144 55.48 273.73 55.48 273.73z'></path>
				<path
					fill='#fff'
					d='M55.48 273.73s2.32 72 62.43 120 143.41 51.43 210.84 56 119.23-33.62 127-91.32-43.72-74.64-71.68-140.33-25.43-87.28-84.58-127.68S147.8 74.81 99.29 144 55.48 273.73 55.48 273.73z'
					opacity='0.7'></path>
			</g>
			<g
				fill='none'
				stroke='#263238'
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth='1.166'>
				<path d='M83.61 179.69v-25.77c0-18.24 15.16-33.08 33.79-33.08s33.79 14.84 33.79 33.08v25.77h13.47v-25.77c0-25.51-21.2-46.27-47.26-46.27s-47.26 20.76-47.26 46.27v25.77z'></path>
				<path d='M65.14 179.87H168.32V265.22H65.14z'></path>
				<path d='M127.46 215.32a11.24 11.24 0 00-22.47 0 11 11 0 005.9 9.68L109 244.38h14.45L121.56 225a11 11 0 005.9-9.68z'></path>
			</g>
			<g>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M232.64 267.99L206.95 266.3 206.95 265.88 203.79 266.09 200.64 265.88 200.64 266.3 174.95 267.99 156 423.79 174.95 423.79 203.16 299.57 204.43 299.57 232.64 423.79 251.59 423.79 232.64 267.99z'></path>
				<path
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M156 423.78l-4.63 7.16-14.32 6.32a4.88 4.88 0 00-2.52 4.21v5.47h40.84a54.21 54.21 0 000-8.84c-.42-4.21-.42-14.32-.42-14.32z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M134.53 442.31v4.63h40.84s.19-2 .19-4.63z'></path>
				<path
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M251.51 423.78l4.63 7.16 14.32 6.32a4.88 4.88 0 012.52 4.21v5.47h-40.84a54.21 54.21 0 010-8.84c.42-4.21.42-14.32.42-14.32z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M273 442.31v4.63h-40.86s-.18-2-.19-4.63z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M164.07 195.51s-30 42.16-30 45.25 4.77 26.95 12.35 29.19 11.79-1.68 13.19-9.54-3.37-19.09-3.37-19.09l14-12.63z'></path>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M158.25 259.29s8.7-1.41 10.95-.85 3.93 5.9 3.93 5.9.84 7.86-.57 9.54-8.14 3.65-10.94 4.21-8.71-5.89-11-9.82 1.73-10.67 7.63-8.98z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M170.38 193.6L164.07 195.51 174.01 261.86 233.09 261.86 242.08 195.89 234.05 192.83 204.41 186.33 170.38 193.6z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M236.34 215.78L235.01 225.34 224.68 227.82 214.16 223.62 214.93 215.01 236.34 215.78z'></path>
				<circle
					cx='225.35'
					cy='223.52'
					r='1.82'
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'></circle>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M198.1 198.57L203.65 205.07 196.57 250.19 204.03 262.05 212.83 249.62 205.37 205.26 211.68 199.14 204.99 190.54 198.1 198.57z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M192.75 187.29L167.32 193.6 168.09 196.66 192.94 189.77 192.75 187.29z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M213.59 186.52L239.02 192.83 238.26 195.89 213.4 189.01 213.59 186.52z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M239 192.83s9.62 2.17 15.51 5.54 7.3 10.95 3.93 19.37-13.75 7.3-18.52 5-6.18-10.66-5.34-14.31'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M193.9 184.04L191.03 185.95 191.79 205.26 204.22 196.47 217.22 205.45 218.37 186.33 214.93 183.46 193.9 184.04z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M219 161.07s7.06-1.72 8.39-8.78-11.39-15.65-20.21-17.17-21.75 7.63-23.85 13.93 6.1 12.59 14.88 13.93 20.79-1.91 20.79-1.91z'></path>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M192.68 162.22s-3.82-5.92-4.77-.77 3.05 7.44 4.77 7.25 0-6.48 0-6.48zM217.49 162.22s3.82-5.92 4.77-.77-3 7.44-4.77 7.25 0-6.48 0-6.48z'></path>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M193.52 173.9L193.52 186.52 204.22 196.47 216.27 186.14 216.27 174.29 193.52 173.9z'></path>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M191.92 158.4s-.58 11.83.38 15.65 7.25 11.83 12.21 13.55 11.83-8.59 13.36-12 .95-17.94.95-17.94-2.09-5-6.29-6.48-17.18-4.18-20.61 7.22z'></path>
				<path
					fill='#263238'
					d='M199.85 164.68c0 .9-.41 1.63-.92 1.63s-.92-.73-.92-1.63.41-1.63.92-1.63.92.73.92 1.63zM211.56 164.68c0 .9-.41 1.63-.92 1.63s-.92-.73-.92-1.63.41-1.63.92-1.63.92.73.92 1.63z'></path>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M201.84 169.24a1.28 1.28 0 100 2.49 1.74 1.74 0 001.11-.37 3.21 3.21 0 004.82.08 1.8 1.8 0 001 .29 1.28 1.28 0 100-2.49'></path>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M203.36 177.07L207.35 177.07'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M191.48 161.27s.14 3.84 1.42 2.84 1.7-7.52.57-8.37-1.99 3.55-1.99 5.53zM216.11 161.27s.15 3.84 1.42 2.84 1.71-7.52.57-8.37-1.99 3.55-1.99 5.53z'></path>
				<path
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M191.48 158.15s.43.35.42.52c1.85 1 6.1 2.84 13 3.21a26.56 26.56 0 0014-3.43v-.82c-.17-4.47-3.49-7.45-7.6-8.59a19.57 19.57 0 00-12.24.61 12 12 0 00-5.07 3.65c-.51.56-3.21 4.29-2.51 4.85z'></path>
				<path
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M191.92 158.4a45.19 45.19 0 0013 .95c8.21-.38 13.92-.95 13.92-.95a22.64 22.64 0 01-13.8 6.06 15.14 15.14 0 01-13.12-6.06z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M170.96 215.78L172.29 225.34 182.62 227.82 193.13 223.62 192.37 215.01 170.96 215.78z'></path>
				<circle
					cx='181.95'
					cy='223.52'
					r='1.82'
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'></circle>
				<path
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M173.13 261.25H233.76V270.79H173.13z'></path>
				<rect
					width='18.53'
					height='11.79'
					x='168.92'
					y='261.81'
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					rx='2.67'></rect>
				<rect
					width='18.53'
					height='11.79'
					x='217.2'
					y='261.81'
					fill='#4c4c4c'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					rx='2.67'></rect>
				<path
					fill='#fff'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M197.83 261.81H211.02V270.23H197.83z'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M156.28 241.32s-8.42-.56-11.51-5.9'></path>
				<ellipse
					cx='249.9'
					cy='202.02'
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					rx='13.9'
					ry='14.6'></ellipse>
				<ellipse
					cx='249.9'
					cy='194.63'
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					rx='10.88'
					ry='9.75'></ellipse>
				<ellipse
					cx='249.9'
					cy='187.46'
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					rx='10.88'
					ry='9.75'></ellipse>
				<path
					fill='#ccc'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M232.42 166.44s.19 14.38.92 18.62 3.69 9.77 7.75 9.77a25.53 25.53 0 007.93-1.47s4.79 2.58 9.4 1.84 3.87-7.19 3.87-10-.55-23.6-.55-23.6.37-2-1.48-2.39a15.8 15.8 0 00-2.76-.37v-4.43a3.36 3.36 0 00-3.14-1.47c-2.39 0-2.58.55-2.58.55v-4.06s-2-3.23-4.61-1.66a3.68 3.68 0 00-1.84 2.95l-.19 3.88s-4.42-1.66-4.79.92-1.11 18.48-1.11 18.48a40.86 40.86 0 00-1.47-7.38c-.92-2.4-5.35-2.4-5.35-.18z'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M245.14 154.64L245.51 171.6'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M251.78 153.53L251.97 171.78'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M257.5 158.88L257.13 171.6'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M242.75 171.42L259.53 172.15'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M239.24 174a4.51 4.51 0 001.81 3.58c1.82 1.14 5.92 4.1 6.37 8.88'></path>
			</g>
			<g fill='#263238'>
				<path d='M350 128.81V131h-5.33v7.76h6.55V141h-9v-21.8h9v2.21h-6.55v7.44zM358.3 119.16c3.42 0 4.86 1.74 4.86 5v1.78c0 2.4-.84 3.89-2.71 4.48 2 .59 2.74 2.21 2.74 4.55v3.4a5.49 5.49 0 00.43 2.61h-2.46a5.7 5.7 0 01-.4-2.64v-3.43c0-2.46-1.15-3.24-3.18-3.24h-1.71V141h-2.43v-21.8zm-.63 10.28c1.94 0 3.09-.63 3.09-3v-2.09c0-2-.72-3-2.52-3h-2.37v8.07zM370.57 119.16c3.43 0 4.86 1.74 4.86 5v1.78c0 2.4-.84 3.89-2.71 4.48 2 .59 2.74 2.21 2.74 4.55v3.4a5.37 5.37 0 00.44 2.61h-2.46a5.66 5.66 0 01-.41-2.64v-3.43c0-2.46-1.15-3.24-3.18-3.24h-1.71V141h-2.43v-21.8zm-.57 10.28c1.93 0 3.08-.63 3.08-3v-2.09c0-2-.71-3-2.52-3h-2.37v8.07zM377.8 124.42c0-3.33 1.65-5.48 5-5.48s5 2.15 5 5.48v11.28c0 3.3-1.65 5.48-5 5.48s-5-2.18-5-5.48zm2.4 11.4c0 2 .84 3.15 2.58 3.15s2.59-1.15 2.59-3.15V124.3c0-2-.81-3.15-2.59-3.15s-2.58 1.18-2.58 3.15zM395 119.16c3.43 0 4.86 1.74 4.86 5v1.78c0 2.4-.84 3.89-2.71 4.48 2 .59 2.74 2.21 2.74 4.55v3.4a5.37 5.37 0 00.44 2.61h-2.46a5.66 5.66 0 01-.41-2.64v-3.43c0-2.46-1.15-3.24-3.18-3.24h-1.71V141h-2.47v-21.8zm-.62 10.28c1.93 0 3.08-.63 3.08-3v-2.09c0-2-.71-3-2.52-3h-2.37v8.07zM329.38 264.88v2.21h-5v9.44h-2.43v-21.8h8.66v2.21h-6.23v7.94zM332.33 260c0-3.33 1.66-5.48 5-5.48s5 2.15 5 5.48v11.28c0 3.3-1.65 5.48-5 5.48s-5-2.18-5-5.48zm2.4 11.4c0 2 .84 3.15 2.59 3.15s2.58-1.15 2.58-3.15v-11.53c0-2-.81-3.15-2.58-3.15s-2.59 1.18-2.59 3.15zM349.5 254.73c3.42 0 4.86 1.74 4.86 5v1.78c0 2.4-.84 3.89-2.71 4.48 2 .59 2.74 2.21 2.74 4.55v3.4a5.37 5.37 0 00.44 2.61h-2.46a5.53 5.53 0 01-.41-2.64v-3.43c0-2.46-1.15-3.24-3.18-3.24h-1.71v9.31h-2.43v-21.8zm-.62 10.27c1.93 0 3.08-.63 3.08-3v-2.09c0-2-.72-3-2.52-3h-2.37V265zM361.8 254.73c3.4 0 4.74 1.62 4.74 4.83v1c0 2.31-.66 3.74-2.56 4.33 2.12.6 2.93 2.28 2.93 4.68v1.83c0 3.28-1.59 5.11-5 5.11h-5v-21.8zm-.59 9.25c1.93 0 2.93-.62 2.93-2.9v-1.28c0-1.93-.66-2.86-2.4-2.86h-2.4v7zm.72 10.34c1.77 0 2.58-.93 2.58-3v-1.93c0-2.43-1-3.24-3.05-3.24h-2.12v8.13zM371.55 254.73v21.8h-2.43v-21.8zM379.15 254.73c3.4 0 5 2 5 5.42v11c0 3.34-1.56 5.39-5 5.39h-5.1v-21.8zm0 19.59c1.75 0 2.59-1.09 2.59-3.08V260c0-2-.84-3.08-2.62-3.08h-2.62v17.38zM391.49 254.73c3.39 0 4.95 2 4.95 5.42v11c0 3.34-1.56 5.39-4.95 5.39h-5.11v-21.8zm0 19.59c1.74 0 2.58-1.09 2.58-3.08V260c0-2-.84-3.08-2.61-3.08h-2.62v17.38zM406.47 264.38v2.18h-5.33v7.76h6.55v2.21h-9v-21.8h9v2.21h-6.55v7.44zM412.08 276.53h-2.18v-21.8h3.1l5 15.76v-15.76h2.15v21.8h-2.53l-5.57-17.63zM306.54 208.26l22.25-52.61h13.35v52.61h5.78v11.12h-5.78v14.12h-12v-14.12h-23.6zm23.58 0V179l-12.34 29.25zM352.48 174.33c0-12.45 6.56-19.57 18.57-19.57s18.58 7.12 18.58 19.57v40.49c0 12.46-6.57 19.57-18.58 19.57s-18.57-7.11-18.57-19.57zm12.23 41.27c0 5.56 2.45 7.67 6.34 7.67s6.34-2.11 6.34-7.67v-42c0-5.57-2.44-7.68-6.34-7.68s-6.34 2.11-6.34 7.68zM421.1 174.78c0-7-2.44-8.9-6.34-8.9s-6.34 2.11-6.34 7.68v5h-11.56v-4.23c0-12.45 6.22-19.57 18.24-19.57s18.24 7.12 18.24 19.57v2c0 8.34-2.67 13.57-8.57 16 6.12 2.67 8.57 8.45 8.57 16.35v6.12c0 12.46-6.23 19.57-18.24 19.57s-18.24-7.11-18.24-19.57v-6.45h11.56v7.23c0 5.56 2.45 7.67 6.34 7.67s6.34-1.89 6.34-8.78v-6.12c0-7.23-2.44-9.9-8-9.9H409v-11.1h4.78c4.56 0 7.34-2 7.34-8.23z'></path>
			</g>
			<g>
				<path
					fill='#263238'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M86.87 446.5L72.61 446.5 91.62 313.99 105.88 313.99 86.87 446.5z'></path>
				<path
					fill='#fff'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M115.39 446.5L129.64 446.5 110.63 313.99 96.38 313.99 115.39 446.5z'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M289.18 446.5L274.93 446.5 293.93 313.99 308.19 313.99 289.18 446.5z'></path>
				<path
					fill='#fff'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M317.7 446.5L331.95 446.5 312.94 313.99 298.69 313.99 317.7 446.5z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M55.73 293.21H327.66V319.57H55.73z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M62.36 293.21H334.29V319.57H62.36z'></path>
				<path
					fill='#263238'
					d='M66.81 319.57L89.89 319.57 101.82 293.21 78.74 293.21 66.81 319.57z'></path>
				<path
					fill='#263238'
					d='M158.17 293.21L135.09 293.21 123.16 319.57 146.24 319.57 158.17 293.21z'></path>
				<path
					fill='#263238'
					d='M327.21 293.21L304.13 293.21 292.21 319.57 315.29 319.57 327.21 293.21z'></path>
				<path
					fill='#263238'
					d='M270.87 293.21L247.78 293.21 235.86 319.57 258.94 319.57 270.87 293.21z'></path>
				<path
					fill='#263238'
					d='M214.52 293.21L191.44 293.21 179.51 319.57 202.59 319.57 214.52 293.21z'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M332.8 304.9L287.8 304.9'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M332.01 309.31L324.91 309.31'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M61.21 308.21L106.21 308.21'></path>
				<path
					fill='none'
					stroke='#263238'
					strokeMiterlimit='10'
					strokeWidth='1.166'
					d='M62 303.25L118.84 303.25'></path>
				<path
					fill='#263238'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M331.37 440.72H408.51V446.51000000000005H331.37z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M395.49 440.56L344.39 440.56 364.42 331.6 375.46 331.6 395.49 440.56z'></path>
				<path
					fill='#fff'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M356.98 372.1L382.91 372.1 380.42 358.6 359.46 358.6 356.98 372.1z'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M387.81 422.37L389.09 429.82'></path>
				<path
					fill='#3B82F6'
					stroke='#263238'
					strokeLinecap='round'
					strokeLinejoin='round'
					strokeWidth='1.166'
					d='M373.22 337.62L386.2 413'></path>
			</g>
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
	Icon403
};
