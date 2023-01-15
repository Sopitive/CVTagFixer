


window.onload = function() {

    let newInterval;
    let renderInterval;

    let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let click_button = document.querySelector("#click-photo");
let canvas1 = document.querySelector("#canvas");
let localstream;

camera_button.addEventListener('click', async function() {
    video.style.display = "block";
    canvas1.style.display = "block"
    clearInterval(renderInterval);
   	let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream;
    localstream = stream;
    renderInterval = setInterval(render, 100);
});



click_button.addEventListener('click', function() {
    video.style.display = "none"
    canvas1.style.display = "none";
    vidOff();
   	//let image_data_url = canvas1.toDataURL('image/jpeg');

   	// data url of the image
   	//console.log(image_data_url);
});


    //let canvas = document.createElement("canvas");



    let canvas = canvas1;


    function vidOff() {
        //clearInterval(theDrawLoop);
        //ExtensionData.vidStatus = 'off';
        video.pause();
        video.src = "";
        localstream.getTracks()[0].stop();
        console.log("Vid off");
      }

    

    function render() {

    canvas1.getContext('2d').drawImage(video, 0, 0, canvas1.width, canvas1.height);
    
    //document.body.appendChild(canvas)
    let ctx = canvas.getContext("2d");
    //let img = document.querySelector("img");
    //img.style.width = "300px"
    //img.style.height = "300px"
    //canvas.width = img.width;
    //canvas.height = img.height;
    //ctx.drawImage(img, 0, 0, img.width, img.height)

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let lastRed = 0;
    let lastBlue = 0;
    let lastGreen = 0;
    let difference = 0;
    let pixelCount = 0;
    let baseRed = 0;
    let baseBlue = 0;
    let baseGreen = 0;
    let strength = 1;

    for(let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];
        const alpha = data[i + 3];
        pixelCount += 1;
        baseGreen = Math.max(lastGreen, green, baseGreen) - strength;
        baseBlue = Math.max(lastBlue, blue, baseBlue) - strength;
        baseRed = Math.max(lastRed, red, baseRed) - strength;
        if (pixelCount >= 300) {
            pixelCount = 0;
            baseGreen = 0;
            baseBlue = 0;
            baseRed = 0;
        }

        difference = Math.max(Math.abs(red - baseRed), Math.abs(green-baseGreen), Math.abs(blue-baseBlue))

        if (difference > 10 && blue) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
        } else {
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
        }

        lastRed = red;
        lastBlue = blue;
        lastGreen = green;
      }
      ctx.putImageData(imgData, 0, 0);
    }
  };