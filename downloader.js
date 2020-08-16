const Fs = require("fs");
const Path = require("path");
const Axios = require("axios");
const videos = require("./json/react-testing-with-jest-and-enzyme.json");
const ProgressBar = require("progress");

const DIR_NAME = "./tutorials/react-testing-with-jest-and-enzyme";

async function download(url, fileName, path) {
	const { data, headers } = await Axios({
		method: "GET",
		url: url,
		responseType: "stream",
	});
	const totalLength = headers["content-length"];

	const progressBar = new ProgressBar(`--> ${fileName} downloading [:bar] :percent :etas`, {
		width: 40,
		complete: "=",
		incomplete: " ",
		renderThrottle: 1,
		total: parseInt(totalLength),
	});

	const writer = Fs.createWriteStream(path);

	data.on("data", (chunk) => progressBar.tick(chunk.length));
	data.pipe(writer);

	return new Promise((resolve, reject) => {
		writer.on("finish", resolve);
		writer.on("error", reject);
	});
}

function getCorrectedFileName(filename) {
	return filename.replace(" - ", "_").replace(/`/g, "").replace(/"/g, "").replace(/-/g, "_").replace("/", "_").replace(/\s/g, "_").replace("?", "").replace(":", "").replace(".", "_");
}

async function downloadAllVideos() {
	let videoList = videos.filter((video) => video.url !== "NO_VIDEO");
	if (!Fs.existsSync(DIR_NAME)) {
		Fs.mkdirSync(DIR_NAME);
	}
	for (let video of videoList) {
		try {
			const fileName = getCorrectedFileName(video.title) + ".mp4";
			const path = Path.resolve(__dirname, DIR_NAME, fileName);
			if (!Fs.existsSync(path)) {
				await download(video.url, fileName, path);
			} else {
				// console.log("--> Already Downloaded --> " + fileName);
			}
		} catch (err) {
			console.error(err);
		}
	}
}

downloadAllVideos();
