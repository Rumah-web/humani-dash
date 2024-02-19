/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	// swcMinify: true,

	// webpack: (config, { isServer }) => {
	// 	if (!isServer) {
	// 		config.resolve.fallback = {
	// 			fs: false,
	// 			path: false,
	// 		};
	// 	}
	// 	return config;
	// },
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: "https",
	// 			hostname: "*.humanicode.com",
	// 			port: "",
	// 			pathname: "/media/api/assets/**",
	// 		},
	// 	],
	// },
	async headers() {
		return [
			{
				// matching all API routes
				source: "/menu/api/:path*",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
					{
						key: "Access-Control-Allow-Methods",
						value: "GET,DELETE,PATCH,POST,PUT",
					},
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
					},
				],
			},
		];
	},
	// headers: {
	// 	source: "/api/:path*",
	// 	headers: [
	// 		{ key: "Access-Control-Allow-Credentials", value: "true" },
	// 		{ key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
	// 		{
	// 			key: "Access-Control-Allow-Methods",
	// 			value: "GET,DELETE,PATCH,POST,PUT",
	// 		},
	// 		{
	// 			key: "Access-Control-Allow-Headers",
	// 			value:
	// 				"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
	// 		},
	// 	],
	// },
};

export default nextConfig;
