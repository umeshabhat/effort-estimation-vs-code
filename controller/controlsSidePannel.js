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

    var lenght = getElement('lenght');
    var entities = getElement('entities');
    var transactions = getElement('transactions');
    var pointsAdj = getElement('pointsAdj');
    var pointsNonAdj = getElement('pointsNonAdj');

    var arrayVars = new Array(lenght, entities, transactions, pointsAdj, pointsNonAdj);


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

    function computeStats() {
        if (validateInputs() === true) {
            
            vscode.postMessage({
                command: 'onOpenPanel',
                text: arrayVars.values.toString()
            });

        } else {
            vscode.postMessage({
                command: 'onError',
                text: 'All inputs must be filled'
            });
        }
    }
}());