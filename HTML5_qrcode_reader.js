function init(html5QrCode) {
    const readCodeBtn = document.querySelector(".reader-btn");
    const closeCameraPopUpBtn = document.querySelector(".close-camera-popup-btn");
    const deleteBtn = document.querySelector(".delete-btn");
    const closePopUpResultBtn = document.querySelector(".close-result-popup-btn");
    const popUpResultWrapper = document.querySelector(".result-pop-up-wrapper")
    const popUpWrapper = document.querySelector(".pop-up-wrapper")
    const cameraPopUpBox = popUpWrapper.querySelector(".camera-pop-up-box")
    const cameraContent = cameraPopUpBox.querySelector(".camera-content")
    
    readCodeBtn.addEventListener("click", function () {
        showPopup()
        let config = Html5QrCodeConfig(cameraPopUpBox);
        startQrCodeReader(config)
    })
    closeCameraPopUpBtn.addEventListener("click", function () {
        try {
            html5QrCode.stop()
            hidePopup()
        } catch (error) {
            console.error("Espere a camera iniciar para fechar a janela -->> ", error);
        }
    })
    closePopUpResultBtn.addEventListener("click", function () {
        hideResult()
    })   
    async function deletarCodigoListener(event){
        var res = await deletarCodigo(event.currentTarget.decodedText)
        
        deleteBtn.removeEventListener("click", deletarCodigoListener)
        closePopUpResultBtn.click();
        
        if (res.affectedRows) {
            // exibir feedback positivo
            console.log("positivo");
        } else {
            // exibir feedback negativo
            console.log("negativo");
        }
    }
    async function deletarCodigo(decodedResult) {
        try {
            var res = await deletaCodigoNaApi(decodedResult)
            return res;
        } catch (error) {
            console.error(error);
            return error            
        }
    } 
    
    function hidePopup() {
        popUpWrapper.classList.add("hide")
    }  
    function showPopup() {
        popUpWrapper.classList.remove("hide")
    }  
    
    function hideResult() {
        popUpResultWrapper.classList.add("hide")        
    }
    function showResult(isCodigoNovo) {
        var feedbackBoxes = popUpResultWrapper.querySelectorAll(".hide")
        feedbackBoxes.forEach(box => {
            box.classList.remove("hide")
        });
        if (isCodigoNovo) {
            popUpResultWrapper.querySelector(".feedback-negativo").classList.add("hide")
        } else {
            popUpResultWrapper.querySelector(".feedback-positivo").classList.add("hide")
        }
        popUpResultWrapper.classList.remove("hide")
    }
    
    async function consultaCodigo(decodedResult) {
        try {
            var isCodigoInDataBase = await consultaQrcodeNaApi(decodedResult);
            return isCodigoInDataBase.length === 0;
        } catch (error) {
            console.error(error);
            return error
        }
    }
    async function registraCodigo(decodedResult) {
        try {
            var isCodigoSalvo = await salvaCodigoNaApi(decodedResult);
            return
        } catch (error) {
            console.error(error);
            return error
        }
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
        })
        .then(cameraId => {
            html5QrCode.start(cameraId, config, async (decodedText, decodedResult) => {
                closeCameraPopUpBtn.click();
                var isCodigoNovo = await consultaCodigo(decodedResult.decodedText);
                if (isCodigoNovo) {
                    await registraCodigo(decodedResult.decodedText)
                } 
                showResult(isCodigoNovo);
                deleteBtn.addEventListener("click", await deletarCodigoListener)
                deleteBtn.decodedText = decodedResult.decodedText;
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
    
    async function consultaQrcodeNaApi(decodedResult) {
        return await fetch('http://localhost:3001/'+ decodedResult, {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}})
        .then(response => response.json()) 
        .then(json => json )
        .catch(err => console.log(err));
    }
    async function salvaCodigoNaApi(decodedResult) {
        // data to be sent to the POST request
        var _data = {
            codigo: decodedResult
        }    
        return await fetch('http://localhost:3001/', 
        {
            method: "POST",
            body: JSON.stringify(_data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => json)
        .catch(err => console.log(err));
    }
    async function deletaCodigoNaApi(decodedResult) {
        return await fetch('http://localhost:3001/'+ decodedResult, 
        {
            method: "DELETE",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => json)
        .catch(err => console.log(err));
    }
}

window.onload = function () {
    var html5QrCode = new Html5Qrcode(/* element id */ "reader")
    init(html5QrCode)
}