

function init(html5QrCode) {
    const readCodeBtn = document.querySelector(".reader-btn");
    const closePopUpBtn = document.querySelector(".close-popup-btn");
    const closePopUpResultBtn = document.querySelector(".close-popup-result-btn");
    const popUpResultWrapper = document.querySelector(".pop-up-result-wrapper")
    const popUpWrapper = document.querySelector(".pop-up-wrapper")
    const popUpBox = popUpWrapper.querySelector(".pop-up-box")
    const cameraContent = popUpBox.querySelector(".cameraContent")
    // const qrInput = formPopup.querySelector("#qrCode")
    
    readCodeBtn.addEventListener("click", function () {
        togglePopup()
        startQrCodeReader()
    })
    closePopUpBtn.addEventListener("click", function () {
        try {
            html5QrCode.stop()
            togglePopup()
        } catch (error) {
            console.error("Espere a camera iniciar para fechar a janela -->> ", error);
        }
    })
    function togglePopup() {
        popUpWrapper.classList.toggle("hide")
    }  

    closePopUpResultBtn.addEventListener("click", function () {
        hideResult()
    })    
    function hideResult() {
        popUpResultWrapper.classList.add("hide")        
    }
    function showResult() {
        popUpResultWrapper.classList.remove("hide")        
    }

    function startQrCodeReader() {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                var cameraId = devices[0].id;
                return cameraId
            }
        }).then(cameraId => {
            // let aspectRatio = screen.width > 590 ? 1.645714 : 1;
            let aspectRatio = screen.width > 590 ? 2 : 0.65;
            let width = screen.width > 590 ? 600 : 200;
            let height = screen.width > 590 ? 350 : 300;
// debugger
            html5QrCode.start(cameraId, 
            {
                fps: 10,    // Optional, frame per seconds for qr code scanning
                aspectRatio,
                qrbox: { width, height }  // Optional, if you want bounded box UI
            },
            (decodedText, decodedResult) => {
                closePopUpBtn.click();
    
                console.log("decodedText: ",decodedText);
                showResult();
                html5QrCode.stop()
            },
            (errorMessage) => {
                // parse error, ignore it.
            })
            .catch((err) => {
            // Start failed, handle it.
            });
        
        }).catch(err => { });
    }

}
    
window.onload = function () {
    var html5QrCode = new Html5Qrcode(/* element id */ "reader")
    init(html5QrCode)
}