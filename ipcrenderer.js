const { ipcRenderer, contextBridge } = require('electron');
const recorder  = require('node-record-lpcm16');
const fs = require('fs');




contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});

contextBridge.exposeInMainWorld(
  'record', 
   {
    record : (data) =>{
      
      const audioStream = recorder.record({
        sampleRateHertz: 44100,
        channels: 2,
        encoding: 'pcm16',
      });
      // Save the audio to a file
      const fileStream = fs.createWriteStream('audio.wav');
      audioStream.stream().pipe(fileStream);
      
      // Stop recording after 5 seconds
      setTimeout(() => {
        audioStream.stop();
      }, 5000);
    } ,
    stop : () =>{
      recording.stop();
    }
  }
)





