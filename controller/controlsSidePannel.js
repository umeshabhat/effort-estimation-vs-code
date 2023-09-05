(function () {
    const vscode = acquireVsCodeApi();

    function getElement(id)  {
        return /** @type {HTMLElement} */ (document.getElementById(id));
    }

    const submitBtn = getElement('computeEffortBtn');
    submitBtn.addEventListener("click", computeStats);

    const uploadFileBtn = getElement('uploadFileBtn');
    uploadFileBtn.addEventListener("click", uploadFile);

    const fileInput = getElement('fileInput');
    fileInput.addEventListener("change", autofillInputs);

    var length = getElement('length');
    var entities = getElement('entities');
    var transactions = getElement('transactions');
    var pointsAdj = getElement('pointsAdj');
    var pointsNonAdj = getElement('pointsNonAdj');

    var arrayVars = new Array(length, entities, transactions, pointsAdj, pointsNonAdj);


    function uploadFile() {
        const fileInput = /** @type {HTMLElement} */ (document.getElementById('fileInput'));
        fileInput.click();
    }

    function autofillInputs() {
        const file = fileInput.files[0];

        var reader = new FileReader();
        reader.onload = function(progressEvent){
            var lines = this.result.split(',');

            for(var line = 0; line < lines.length; line++){
                arrayVars[line].value = lines[line].trim();
            }
        };
        reader.readAsText(file);
    }

    function validateInputs() {
        for (var i = 0; i < arrayVars.length ; i++) 
        {
            if (arrayVars[i].value === '') { return false; }
        }

        return true;
    }

    function httpGet(theUrl) {
        let xmlHttpReq = new XMLHttpRequest();
        xmlHttpReq.open("GET", theUrl, false);
        xmlHttpReq.send(null);

        return xmlHttpReq.responseText;
      }

    function generateUrl() {
        let url = 'http://127.0.0.1:5000/effort-estimator?';

        url = url.concat('&length=', arrayVars[0].value);
        url = url.concat('&noEntities=', arrayVars[1].value);
        url = url.concat('&noTransactions=', arrayVars[2].value);
        url = url.concat('&adjPoints=', arrayVars[3].value);
        url = url.concat('&nonAdjPoints=', arrayVars[4].value);

        return url;
      }

    function computeStats() {
        if (validateInputs() === true) {

            const url = generateUrl();
            const prediction = JSON.parse(httpGet(url)).predictedValue;
            
            vscode.postMessage({
                command: 'onOpenPanel',
                text: prediction
            });

        } else {
            vscode.postMessage({
                command: 'onError',
                text: 'All inputs must be filled'
            });
        }
    }
}());