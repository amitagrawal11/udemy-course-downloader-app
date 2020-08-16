function getVideoURL(element) {
	return new Promise((resolve, reject) => {
		// trigger click on element and wait for two seconds
		element.click();

		setTimeout(() => {
			// find the url of video and log in console panel
			const videoElem = document.getElementsByTagName("video");
			if(videoElem && videoElem.length) {
			    let videoUrl = document.getElementsByTagName("video")[0].src;
                if (videoUrl) {
                    resolve(videoUrl);
                } else {
                    reject(element);
                }   
			} else {
			    resolve('NO_VIDEO');
			}
		}, 4000);
	});
}

function storeVideo(url, title, coursePath) {
	const videoObj = { url, title, coursePath };
	const key = "TestKey";
	if (!window.localStorage.getItem(key)) {
		window.localStorage.setItem(key, JSON.stringify([videoObj]));
	} else {
		const videos = JSON.parse(window.localStorage.getItem(key));
		videos.push(videoObj);
		window.localStorage.setItem(key, JSON.stringify(videos));
	}
}

async function downloadUdemyVideos() {
	// cleanup 
	cleanLocalStorage();
	// get all divs
	let allDivs = document.querySelectorAll("li[class|=curriculum-item-link] > div");

	// click on one item
	let counter = 0;
	for (let divElem of allDivs) {
		try {
			let videoUrl = await getVideoURL(divElem);
			console.log(++counter + " Video url is " + videoUrl);

			storeVideo(videoUrl, divElem.ariaLabel, divElem.baseURI);
			console.log("Added: " + divElem.ariaLabel);
		} catch (e) {
			console.log("error appeared ", e);
		}
	}
}
function expandSections() {
	let divs = document.getElementsByClassName("section--section-heading--2k6aW");
	for(let div of divs) {
		div.click();
	}
}

function cleanLocalStorage() {
	window.localStorage.removeItem('TestKey');
}

//expandSections();
downloadUdemyVideos();