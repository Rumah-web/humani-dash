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

export function formatTime(dateParams: Date) {
	const date = new Date(dateParams);

	// current hours
	let hours = date.getHours().toString().padStart(2, "0")

	// current minutes
	let minutes = date.getMinutes().toString().padStart(2, "0")

	return `${hours}:${minutes} WIB`
}

export const resizeImage = async (
	dir: string,
	width: number,
	height?: number | null,
	fill?: "contain" | "cover" | "fill" | "inside" | "outside"
) => {
	return "";
};

export const convertBase64 = (file: Blob) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = () => {
			resolve(fileReader.result);
		};
		fileReader.onerror = (error) => {
			reject(error);
		};
	});
};

export const generateOrderNo = (val: string) => {
	const current = new Date();
	const month = String(current.getMonth() + 1).padStart(2, "0");
	const date = String(current.getDate()).padStart(2, "0");

	return `TR_${current.getFullYear()}${month}${date}${val}`;
};

export const generateInvoiceNo = (val: string | null) => {
	return `INV_${val}`;
};

export const invoiceDueDate = (start_date: Date) => {
	const dueDate = start_date.setDate(start_date.getDate() - 2);

	return new Date(dueDate);
};
