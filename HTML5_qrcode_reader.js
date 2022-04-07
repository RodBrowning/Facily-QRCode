function init(html5QrCode) {
    const readCodeBtn = document.querySelector(".reader-btn");
    const closeCameraPopUpBtn = document.querySelector(".close-camera-popup-btn");
    const closePopUpResultBtn = document.querySelector(".close-result-popup-btn");
    const popUpResultWrapper = document.querySelector(".result-pop-up-wrapper")
    const popUpWrapper = document.querySelector(".pop-up-wrapper")
    const cameraPopUpBox = popUpWrapper.querySelector(".camera-pop-up-box")
    const cameraContent = cameraPopUpBox.querySelector(".camera-content")
    // const qrInput = formPopup.querySelector("#qrCode")
    
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
    async function isCodigoNovo(decodedResult) {
        // Consultar se resultado existe no banco
        // Se se sim retorna true;
        // Se não retorna false;
    }
    async function registraCodigo(decodedResult) {
        // Salva código no banco
    }
    function showResult(isCodigoNovo) {
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
                closeCameraPopUpBtn.click();
                // let isCodigoNovo = await isCodigoNovo(decodedResult);
                // if (isCodigoNovo) {
                //     await registraCodigo(decodedResult)
                // } 
                // showResult(isCodigoNovo);
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

// async function consultaQrcodeNaApi(decodedResult) {
//     return fetch('https://api.github.com/users/manishmshiva', {
//       method: "GET",
//       headers: {"Content-type": "application/json;charset=UTF-8"}
//     })
//     .then(response => response.json()) 
//     .then(json => console.log(json)); 
//     .catch(err => console.log(err));
// }

// async function salvaCodigoNaApi(decodedResult) {
//     // data to be sent to the POST request
//     let _data = {
//         title: "foo",
//         body: "bar", 
//         userId:1
//     }    
//     return fetch('https://jsonplaceholder.typicode.com/posts', {
//         method: "POST",
//         body: JSON.stringify(_data),
//         headers: {"Content-type": "application/json; charset=UTF-8"}
//     })
//     .then(response => response.json()) 
//     .then(json => console.log(json));
//     .catch(err => console.log(err));
// }

// async function deletaCodigoNaApi(decodedResult) {

// }
