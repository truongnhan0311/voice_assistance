function getSentence(transcripts) {
    const uniqueWords = [...new Set(transcripts)]; // Remove duplicates
    let finalSentence = uniqueWords.join(" ").trim();
    //console.log('First Final', finalSentence)
    for(let word of finalSentence.split(' ')){
        //console.log('Word check:', word);
        const subsStr = finalSentence.split(word.trim());
        //console.log('Word check occur:', subsStr.length + 'with this word:' + word)
        if(subsStr.length > 2){
            finalSentence = finalSentence.replace(word, '').trim()
            //console.log('After remove', word + '| ' + finalSentence)
        }
    }

    return finalSentence;
}


const useMostLength = (chunkTranscripts) => {
    let lgth = 0;
    let finalSentence

    for (var i = 0; i < chunkTranscripts.value.length; i++) {
        if (chunkTranscripts.value[i].length > lgth) {
            lgth = chunkTranscripts.value[i].length;
            finalSentence = chunkTranscripts.value[i];
        }
    }

    return finalSentence;
}

function generateUUID() {
    var d = new Date().getTime();
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;
        if(d > 0){
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
