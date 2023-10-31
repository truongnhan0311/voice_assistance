const record = document.querySelector('.record');
const stop = document.querySelector('.stop');
let chunks = []; 

function initMedia(stream){
  mediaRecorder = new MediaRecorder(stream);
  
  return mediaRecorder
}

if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');


    const constraints = { audio: true };
    let recognition = initSpeechRecognition();

    let onSuccess = function(stream) {
        const mediaRecorderFull = initMedia(stream); 
        record.onclick = function() {
          mediaRecorderFull.start();

          startRecognition(recognition, stream)
    
          console.log(mediaRecorderFull.state);
          console.log("recorder started");
          record.style.background = "red";
    
          stop.disabled = false;
          record.disabled = true;
        }
    
        stop.onclick = function() {
         
          mediaRecorderFull.stop();
          stopRecognition(recognition, stream)

          console.log(mediaRecorder.state);
          console.log("recorder stopped");
          record.style.background = "";
          record.style.color = "";
          // mediaRecorder.requestData();
    
          stop.disabled = true;
          record.disabled = false;
        }
    
        mediaRecorderFull.onstop = function(e) {
          console.log("data available after MediaRecorder.stop() called.");
    
        //   const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
    
        //   const clipContainer = document.createElement('article');
        //   const clipLabel = document.createElement('p');
        //   const audio = document.createElement('audio');
        //   const deleteButton = document.createElement('button');
    
        //   clipContainer.classList.add('clip');
        //   audio.setAttribute('controls', '');
        //   deleteButton.textContent = 'Delete';
        //   deleteButton.className = 'delete';
    
        //   if(clipName === null) {
        //     clipLabel.textContent = 'My unnamed clip';
        //   } else {
        //     clipLabel.textContent = clipName;
        //   }
    
        //   clipContainer.appendChild(audio);
        //   clipContainer.appendChild(clipLabel);
        //   clipContainer.appendChild(deleteButton);
        //   soundClips.appendChild(clipContainer);
    
          //audio.controls = true;
          const blob = new Blob(chunks, { 'type' : 'audio/wav; codecs=opus' });
          chunks = [];
          const audioURL = window.URL.createObjectURL(blob);
          audio.src = audioURL;
          console.log(blob);
          console.log("recorder stopped");
    
        //   deleteButton.onclick = function(e) {
        //     e.target.closest(".clip").remove();
        //   }
    
        //   clipLabel.onclick = function() {
        //     const existingName = clipLabel.textContent;
        //     const newClipName = prompt('Enter a new name for your sound clip?');
        //     if(newClipName === null) {
        //       clipLabel.textContent = existingName;
        //     } else {
        //       clipLabel.textContent = newClipName;
        //     }
        //   }
        }
    
        mediaRecorderFull.ondataavailable = function(e) {

            console.log(e.data);
            chunks.push(e.data);
        }
      }
    
      let onError = function(err) {
        console.log('The following error occured: ' + err);
      }




    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
}
