function downloadVideo(element) {
	return new Promise((resolve, reject) => {
		// trigger click on element and wait for two seconds
		element.click();

		setTimeout(() => {
			// find the url of video and log in console panel
			let videoUrl = document.getElementsByTagName("video")[0].src;
			if (videoUrl) {
				resolve(videoUrl);
			} else {
				reject(element);
			}
		}, 4000);
	});
}

function saveUrlInDB(url) {
	return new Promise((resolve, reject) => {
		let xhttp = new XMLHttpRequest();
		let apiUrl = "http://localhost:4000/?url=" + url;
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				resolve(this.responseText);
			} else {
				reject(this.responseText);
			}
		};
		xhttp.open("GET", apiUrl, true);
		xhttp.send();
	});
}

async function downloadUdemyVideos() {
	// get all divs
	let allDivs = document.querySelectorAll("li[class|=curriculum-item-link] > div");

	// click on one item
	let counter = 0;
	for (let divElem of allDivs) {
		try {
			let videoUrl = await downloadVideo(divElem);
			console.log(++counter + " Video url is " + videoUrl);

			let response = await saveUrlInDB(videoUrl);
			console.log(counter + " Persisted url in db with response msg : " + response);
		} catch (e) {
			console.log("error appeared ", e);
		}
	}
}

downloadUdemyVideos();
