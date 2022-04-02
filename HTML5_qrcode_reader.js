function init(html5QrCode) {
    const readCodeBtn = document.querySelector(".reader-btn");
    const closePopUpBtn = document.querySelector(".close-popup-btn");
    const closePopUpResultBtn = document.querySelector(".close-result-popup-btn");
    const popUpResultWrapper = document.querySelector(".result-pop-up-wrapper")
    const popUpWrapper = document.querySelector(".pop-up-wrapper")
    const cameraPopUpBox = popUpWrapper.querySelector(".camera-pop-up-box")
    const cameraContent = cameraPopUpBox.querySelector(".cameraContent")
    // const qrInput = formPopup.querySelector("#qrCode")
    
    readCodeBtn.addEventListener("click", function () {
        showPopup()
        let config = Html5QrCodeConfig(cameraPopUpBox);
        startQrCodeReader(config)
    })
    closePopUpBtn.addEventListener("click", function () {
        try {
            html5QrCode.stop()
            hidePopup()
        } catch (error) {
            console.error("Espere a camera iniciar para fechar a janela -->> ", error);
        }
    })
    
    function hidePopup() {
        popUpWrapper.classList.add("hide")
    }  
    function showPopup() {
        popUpWrapper.classList.remove("hide")
    }  

    closePopUpResultBtn.addEventListener("click", function () {
        hideResult()
    })    
    function hideResult() {
        popUpResultWrapper.classList.add("hide")        
    }
    function isCodigoNovo(decodedResult) {
        // Consultar se resultado existe no banco
        // Se não, salvar e retornar true;
        // Se se sim retorna falso;
    }
    function showResult(tipoDeFeedback) {
        // Show feedback positivo se true
        // Show feedback negativo se false
        popUpResultWrapper.classList.remove("hide")
    }

    function Html5QrCodeConfig(cameraPopUpBox) {
        var popUpWidth = cameraPopUpBox.offsetWidth
        var popUpHeight = cameraPopUpBox.offsetHeight
        
        if(popUpWidth > 590){
            var widthPercentage = 0.5
            var heightPercentage = 0.7
        } else {
            var widthPercentage = 0.7
            var heightPercentage = 0.8
        }

        return {
            fps: 10,    // Optional, frame per seconds for qr code scanning
            aspectRatio: (popUpWidth / popUpHeight),
            qrbox: { 
                width: (popUpWidth * widthPercentage), 
                height: (popUpHeight * heightPercentage)
            }  // Optional, if you want bounded box UI
        }
         
    }
    function startQrCodeReader(config) {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                var cameraId = devices[0].id;
                return cameraId
            }
        }).then(cameraId => {
            html5QrCode.start(cameraId, config,
            (decodedText, decodedResult) => {
                closePopUpBtn.click();
                let tipoDeFeedback = isCodigoNovo(decodedResult);
                showResult(tipoDeFeedback);
                html5QrCode.stop()
            },
            (errorMessage) => {
                // parse error, ignore it.
            })
            .catch((err) => {
                hidePopup()
            });
        
        }).catch(err => { 
            hidePopup()
        });
    }

}
    
window.onload = function () {
    var html5QrCode = new Html5Qrcode(/* element id */ "reader")
    init(html5QrCode)
}