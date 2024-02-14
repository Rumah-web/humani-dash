import { execFileSync } from "child_process";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";

const sharp = require('sharp');

export function formatLongtDate(dateParams: Date) {
	const date = new Date(dateParams);

	let tahun = date.getFullYear();
	let bulan = date.getMonth() as any;
	let tanggal = date.getDate();
	let hari = date.getDay() as any;

	switch (hari) {
		case 0:
			hari = "Minggu";
			break;
		case 1:
			hari = "Senin";
			break;
		case 2:
			hari = "Selasa";
			break;
		case 3:
			hari = "Rabu";
			break;
		case 4:
			hari = "Kamis";
			break;
		case 5:
			hari = "Jum'at";
			break;
		case 6:
			hari = "Sabtu";
			break;
	}
	switch (bulan) {
		case 0:
			bulan = "Januari";
			break;
		case 1:
			bulan = "Februari";
			break;
		case 2:
			bulan = "Maret";
			break;
		case 3:
			bulan = "April";
			break;
		case 4:
			bulan = "Mei";
			break;
		case 5:
			bulan = "Juni";
			break;
		case 6:
			bulan = "Juli";
			break;
		case 7:
			bulan = "Agustus";
			break;
		case 8:
			bulan = "September";
			break;
		case 9:
			bulan = "Oktober";
			break;
		case 10:
			bulan = "November";
			break;
		case 11:
			bulan = "Desember";
			break;
	}

	return hari + ", " + tanggal + " " + bulan + " " + tahun;
}

export function formatShorttDate(dateParams: Date) {
	const date = new Date(dateParams);

	let tahun = date.getFullYear();
	let bulan = date.getMonth() as any;
	let tanggal = date.getDate();

	switch (bulan) {
		case 0:
			bulan = "Januari";
			break;
		case 1:
			bulan = "Februari";
			break;
		case 2:
			bulan = "Maret";
			break;
		case 3:
			bulan = "April";
			break;
		case 4:
			bulan = "Mei";
			break;
		case 5:
			bulan = "Juni";
			break;
		case 6:
			bulan = "Juli";
			break;
		case 7:
			bulan = "Agustus";
			break;
		case 8:
			bulan = "September";
			break;
		case 9:
			bulan = "Oktober";
			break;
		case 10:
			bulan = "November";
			break;
		case 11:
			bulan = "Desember";
			break;
	}

	return tanggal + " " + bulan + " " + tahun;
}

export const resizeImage = async (
	dir: string,
	width: number,
	height?: number | null,
	fill?: "contain" | "cover" | "fill" | "inside" | "outside"
) => {
	// const dir_upload = path.dirname(dir);
	// const file_name = path.basename(dir);
	// let dir_transform = `${dir_upload}/${width}/${fill}`;
	// if (height) {
	// 	dir_transform = `${dir_upload}/${width}x${height}/${fill}`;
	// }
	// if (!existsSync(dir_transform)) {
	// 	mkdirSync(dir_transform, { recursive: true });
	// }

	// const path_transform = `${dir_transform}/${file_name}`;

	// if (existsSync(path_transform)) {
    //     return path_transform
	// } else {
	// 	return sharp(dir)
	// 		.resize(width, height, {
	// 			fit: fill ? fill : "cover",
	// 		})
	// 		.toFile(path_transform)
	// 		.then(() => {
	// 			return path_transform;
	// 		});
	// }
};
