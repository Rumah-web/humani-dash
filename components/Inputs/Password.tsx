"use client";

import { useEffect, useState } from "react";

const InputPassword = ({value, disabled, onChange, placeholder}: {placeholder?: string, value?: any, disabled?: boolean, onChange?: (e: any) => void}) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [val, setVal] = useState('')

    const onHideShowPassword = () => {
        setShowPassword(!showPassword)
    }

	useEffect(() => {
		setVal(value)
	}, [value])

	return (
		<>
			<input
				type={showPassword ? 'text' : 'password'}
				placeholder={placeholder ? placeholder : ''}
				name='password'
				className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary disabled:bg-whiter'
				value={val}
				disabled={disabled ? disabled : false}
				onChange={(e) => {
					(onChange && typeof onChange === 'function') ? onChange(e) : () => null
				} }
				
			/>

			<div className='absolute right-4 top-4 cursor-pointer' onClick={onHideShowPassword}>
				{showPassword ? (
					<div>
						<svg
							width='22'
							height='22'
							viewBox='0 0 576 512'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								fill='currentColor'
								d='M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19M288 400a144 144 0 1 1 144-144a143.93 143.93 0 0 1-144 144m0-240a95.31 95.31 0 0 0-25.31 3.79a47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160'
							/>
						</svg>
					</div>
				) : (
					<div>
						<svg
							width='22'
							height='22'
							viewBox='0 0 640 512'
							xmlns='http://www.w3.org/2000/svg'>
							<path
								fill='currentColor'
								d='M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61m313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07a32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45m-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z'
							/>
						</svg>
					</div>
				)}
			</div>
		</>
	);
};

export default InputPassword;
