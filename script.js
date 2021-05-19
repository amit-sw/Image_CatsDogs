// Javascript code based on https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/ 
//var ENDPOINT='https://yyuen2447j.execute-api.us-east-1.amazonaws.com/Predict/b21f3373-05cd-4ffe-86f3-1f29779f6319'
var ENDPOINT='https://1l5sld8h14.execute-api.us-east-1.amazonaws.com/Predict/adeb4ae1-d0c5-41e6-831c-9f772e068b65'
var results={}

function handleFiles(files) {
  resetState()
  files = [...files]
  files.forEach(previewFile)
  files.forEach(uploadFile)
}

function resetState() {
  removeAllChildNodes(document.getElementById('prediction'))
  removeAllChildNodes(document.getElementById('gallery'))
  results={}
}

function previewFile(file) {
  console.log("Calling preview")
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
  }
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


function uploadFile(file) {

  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    //var b64 = reader.result.replace(/^data:.+;base64,/, '');
    let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
      if ((encoded.length % 4) > 0) {
        encoded += '='.repeat(4 - (encoded.length % 4));
      }
    //console.log(encoded);
    fetch(ENDPOINT, {
       method: 'POST',
        body: encoded
    })
    .then(function(response) {
      console.log('Got response:',response)
       return response.json();
    }).then(function(data) {
      console.log('Got data:',data);
      let l = data['predicted_label']
      console.log('Saw prediction:',l,)
      processPrediction(predictionDetail(l))
    })
    .catch(() => { /* Error. Inform the user */ })
    console.log("Sending the file to the server")
    }
}

function predictionDetail(predictedValue) {
  return "AI saw: "+predictedValue
}

function processPrediction(pd) {
  console.log("Processing prediction detail: ",pd)
  removeAllChildNodes(document.getElementById('prediction'))
  let newContentNode = document.createTextNode(pd);
  document.getElementById('prediction').appendChild(newContentNode)
}



