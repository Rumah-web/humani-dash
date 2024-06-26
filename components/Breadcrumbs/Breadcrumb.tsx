import { cx, css } from "@emotion/css";
import Link from "next/link";
interface BreadcrumbProps {
	pageName: string;
	breadLinks?: [{ label: string; url: string }];
}
const Breadcrumb = ({ pageName, breadLinks }: BreadcrumbProps) => {
	return (
		<div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
			<h2 className='text-title-md2 font-semibold text-black dark:text-white'>
				{pageName}
			</h2>

			<nav>
				<ol className='flex items-center gap-2'>
					<li>
						<Link
							className='font-medium'
							href='/'>
							Dashboard /
						</Link>
					</li>
					{breadLinks &&
						breadLinks.map((link, i) => {
							return (
								<li
									key={i}
									className={cx(
										`font-medium text-primary cursor-pointer`,
										css`
											::after {
                        content: '/';
                        padding-left: 10px;
											}
										`
									)}>
									<Link href={`${link.url}`}>{link.label}</Link>
								</li>
							);
						})}
					<li className='font-medium text-primary'>{pageName}</li>
				</ol>
			</nav>
		</div>
	);
};

export default Breadcrumb;
