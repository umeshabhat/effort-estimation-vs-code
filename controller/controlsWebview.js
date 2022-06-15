(function () {
    const vscode = acquireVsCodeApi();

    function httpGet(theUrl) {
      let xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.open("GET", theUrl, false); 
      xmlHttpReq.send(null);
      
      return xmlHttpReq.responseText;
    }
    
    const changeNum = () => {
        const randomNum = JSON.parse(httpGet('http://192.168.1.215:5000/effort-estimator')).predictedValue;
        let title = /** @type {HTMLElement} */ (document.querySelector('.loader__title'));
      
        let currentNumber = title.innerText;
        
        setInterval(() => {
           if (currentNumber < randomNum) {
            currentNumber++;
            title.innerText = currentNumber;
          } else if (currentNumber > randomNum) {
            currentNumber--;
            title.innerText = currentNumber;
          }
        }, 1);
      };

    changeNum();

}());