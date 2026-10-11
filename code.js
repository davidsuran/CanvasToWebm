function recordCanvas(durationInSeconds = 10) {
    const canvasElement = document.querySelector('canvas');
    if (canvasElement == undefined) {
        console.error("No canvas found.");
    }

    const fps = 60;
    const bitrate = 25000000;
    
    const mimeTypes = ['video/webm; codecs=vp8', 'video/webm'];
    let selectedMimeType = '';
    for (const mime of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mime)) {
            selectedMimeType = mime;
            break;
        }
    }

    const options = { 
        mimeType: selectedMimeType,
        videoBitsPerSecond: bitrate
    };
    
    const stream = canvasElement.captureStream(fps); 
    const mediaRecorder = new MediaRecorder(stream, options);
    const recordedChunks = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `canvas-recording-${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        console.log("Recording finished.");
    };

    mediaRecorder.start();
    console.log(`Recording starting for ${durationInSeconds}s`);

    setTimeout(() => {
        mediaRecorder.stop();
    }, durationInSeconds * 1000);
}
