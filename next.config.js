/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const withImages = require('next-images')

const images = withImages({
	future: {
		webpack5: true
	}
})
module.exports = {
	i18n,
	reactStrictMode: true,
	images,
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ["d552-223-236-113-187.ngrok.io"],
	},
};
