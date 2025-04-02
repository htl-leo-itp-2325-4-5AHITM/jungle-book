(() => {
    const ipAddress1 = "https://it200247.cloud.htl-leonding.ac.at";
    const width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream

    let streaming = false;

    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;
    let camera = null;

    startup();

    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    }

    function startup() {
      if (showViewLiveResultButton()) {
        return;
      }
    
      video = document.getElementById("video");
      canvas = document.getElementById("canvas");
      startbutton = document.getElementById("startbutton");
      camera = document.getElementsByClassName("camera")[0];

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
              height = width / (4 / 3);
            }

            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);

            canvas.style.display = "none";

            streaming = true;
          }
        },
        false,
      );
      startbutton.addEventListener(
        "click",
        (ev) => {
          takepicture();
          ev.preventDefault();
        },
        false,
      );
      clearphoto();
    }

    function clearphoto() {
      const context = canvas.getContext("2d");
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);

      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    }
    // other changes before drawing it.

    async function takepicture() {
      const context = canvas.getContext("2d");
      // camera.innerHTML = "<img id='photo' alt='The screen capture will appear in this box.' />"
      // photo = document.getElementById("photo");

      
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
  
        /*hier wird die kamera entfernt*/
        //camera.innerHTML = "";

        const data = canvas.toDataURL("image/jpg");
        if (data) {
          localStorage.clear();
          localStorage.setItem("data", data);
          //sendImageToServer(data);
          canvas.style.display = "inline";
        } else {
          clearphoto();
        }
        // photo.setAttribute("src", data);
      } else {
        clearphoto();
      }
    }
    window.addEventListener("load", startup, false);
  })();
  
  function sendImageToServer(dataUrl) {
    if (window.checkLocation()) {
      // Remove the prefix from the dataUrl
      const base64Data = dataUrl.replace('data:image/jpg;base64,', '');
      
      // Convert base64 to raw binary data held in a string
      const byteCharacters = atob(base64Data);
      
      // Convert raw binary to an array of 8-bit unsigned integers
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      // Convert the array to a Blob
      const blob = new Blob([new Uint8Array(byteNumbers)], {type: 'image/jpg'});
      let formData = new FormData();
      formData.append("image", blob);
      // Send the Blob to the server
      fetch(ipAddress1 + '/api/journal/upload-photo', {
        method: 'POST',
        body: formData
      }).then(response => response.arrayBuffer())
      .then(buffer => {
        const blob = new Blob([buffer]);

        // Create a Blob URL
        const url = window.URL.createObjectURL(blob);
        
        // Create a link and set the URL
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Journal.pdf';
        //Append the link to the body
        document.body.appendChild(link);
        //Programmatically click the link to start the download
        //link.click();
        

        // Clean up: remove the link after the download starts
        document.body.removeChild(link);
        canvas.style.display = "inline";
      });
    }
  }

  function clearCanvas() {
    canvas.style.display = "none";
  }

  function usePhoto() {
    let data = localStorage.getItem("data");
  }
