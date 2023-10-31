let transcript = '';
let transcriptsAll = [];
let transcripts = []
let sentence = [];
let stopSpeechRecognition = false;
let mediaRecorder = null;
let partChunks = [];
let mediaRecords = []
let uuid;

function initSpeechRecognition()
{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;


    let recognition = new SpeechRecognition();
    //if (SpeechGrammarList) {
    // SpeechGrammarList is not currently available in Safari, and does not have any effect in any other browser.
    // This code is provided as a demonstration of possible capability. You may choose not to use it.
    //var speechRecognitionList = new SpeechGrammarList();
    //var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    //speechRecognitionList.addFromString(grammar, 1);
    //recognition.grammars = speechRecognitionList;
    //}
    recognition.continuous = false;
    recognition.lang = "ja-JP";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    return recognition;
}

function onResult(recognition){

    recognition.onresult = function(event) {
        // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
        // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
        // It has a getter so it can be accessed like an array
        // The first [0] returns the SpeechRecognitionResult at the last position.
        // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
        // These also have getters so they can be accessed like arrays.
        // The second [0] returns the SpeechRecognitionAlternative at position 0.
        // We then return the transcript property of the SpeechRecognitionAlternative object
        //console.log("Event", event.results);
        transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');
        transcripts.push(
            transcript.trim()
        )
    }
}

function onStart(recognition){
    recognition.onstart = function() {
        console.log('start')

        finalSentence = useMostLength(transcript);

        if(finalSentence.length > 0) {
            transcripts.push(finalSentence.trim());
            sentence.push({uuid: uuid, sentence: finalSentence.trim()})

            const item = sentence.find(item => item.uuid === uuid);
            const voice = mediaRecords.find(item => item.uuid === uuid);


            transcripts.push(finalSentence.trim());


            $('.output').append('<p class="'+uuid+'">' + item.sentence +
            ' <br><audio controls "><source class="audio_'+ uuid + '" src="'+ voice.audioURL +'" type="audio/ogg" /></audio></p>');

            //$('".audio_'+uuid+'"').attr('src', audioURL )
            console.log(mediaRecords);
            console.log(sentence);
        }
        //console.log("Transcript", finalSentence);
        transcript = '';

        transcriptsAll.push({uuid: uuid, transcripts: transcripts})
        transcripts = [];
        uuid = generateUUID();
        //console.log(transcriptsAll)
    }
}


function stopRecognition(recognition) {
    stopSpeechRecognition  = true;
    recognition.stop();
    onMediaDataStop(mediaRecorder);

    let  alltranscript = '';

    for(let smallSentence of sentence){
        alltranscript += ' ' + smallSentence.sentence;
    }
    $('.alltranscript').text(alltranscript);
}

function onSpeechend(recognition, stream) {
    recognition.onspeechend = function() {
        if(stopSpeechRecognition === true){
            return;
        }

        console.log('end')
        recognition.stop();

        try{
            setTimeout(function(){

                recognition.start();
                onMediaDataStop(mediaRecorder);
                mediaRecorder = initMedia(stream)
                onMediaDataStart(mediaRecorder)
            }, 400);
        }
        catch{
            console.log('onspeechend ')
        }

    }
}

function onNomatch(recognition) {
    recognition.onnomatch = function(event) {
        console.log('onnomatch');
    }
}


function onError(recognition) {
    recognition.onerror = function(event) {
        console.log(event.error);
        recognition.stop();

        try{
            setTimeout(function(){ recognition.start(); }, 400);
        }
        catch{
            console.log('onerror ')
        }
    }
}



function startRecognition(recognition, stream)
{
    recognition.start();
    mediaRecorder = initMedia(stream)
    onMediaDataStart(mediaRecorder)

    stopSpeechRecognition = false;
    onResult(recognition, stream);
    onStart(recognition, stream);
    onSpeechend(recognition, stream);
}


function onMediaDataStart(mediaRecorder){
    console.log("part recorder started");
    mediaRecorder.start();
    mediaRecorder.ondataavailable = function(e) {
       //console.log(e.data);
        partChunks.push(e.data);
    }

}

function onMediaDataStop(mediaRecorder){

    mediaRecorder.stop();
    mediaRecorder.onstop = function(e) {
        //console.log("data available after MediaRecorder.stop() called.");
        const blob = new Blob(partChunks, { 'type' : 'audio/ogg; codecs=opus' });
        partChunks = [];

        const audioURL = window.URL.createObjectURL(blob);
        mediaRecords.push({
            uuid: uuid,
            audioURL: audioURL
        });


        console.log(audioURL)
        //console.log(blob);
        console.log("part recorder stopped");
    }
}
