const { ipcMain, session } = require('electron');
const electron = require('electron');
const desktopCapturer = electron.desktopCapturer;
const { app, BrowserWindow } = electron;
const fs = require('fs');
const path = require('path');


let mainWindow = null;
let mediaRecorder = null;
let chunks = [];

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 720,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'ipcrenderer.js')
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

function startRecording() {

    console.log("first")

    desktopCapturer.getSources({ types: ['screen'] }).then(async sources => {

        console.log(sources)
        for (const source of sources) {
            console.log(sources)
            if (source.name === 'Entire screen') {
                mainWindow.webContents.send('SET_SOURCE', source.id)
                return
            }
        }
    })
    // desktopCapturer.getSources({  types: ['window', 'screen'] }, (error, sources) => {
    //     console.log("first")
    //     if (error) throw error;

    //     const source = sources[0];

    //     navigator.webkitGetUserMedia({
    //         audio: false,
    //         video: {
    //             mandatory: {
    //                 chromeMediaSource: 'desktop',
    //                 chromeMediaSourceId: source.id,
    //                 minWidth: 1280,
    //                 maxWidth: 1280,
    //                 minHeight: 720,
    //                 maxHeight: 720
    //             }
    //         }
    //     }, (stream) => {
    //         mediaRecorder = new MediaRecorder(stream, {
    //             mimeType: 'video/webm; codecs=vp9'
    //         });
    //         console.log("🚀 ~ file: main.js:50 ~ desktopCapturer.getSources ~ mediaRecorder:", mediaRecorder)

    //         mediaRecorder.ondataavailable = (event) => {
    //             chunks.push(event.data);
    //         };

    //         mediaRecorder.onstop = () => {
    //             const blob = new Blob(chunks, { type: 'video/webm' });
    //             const url = URL.createObjectURL(blob);
    //             console.log("🚀 ~ file: main.js:60 ~ desktopCapturer.getSources ~ url:", url)

    //             mainWindow.webContents.send('recording-stopped', url);
    //         };

    //         mediaRecorder.start();

    //         mainWindow.webContents.send('recording-started');

    //     }, (error) => {
    //         console.log(error);
    //     });
    // });
}

function stopRecording() {
    mediaRecorder.stop();
    chunks = [];
}

ipcMain.on
    ('start-recording', () => {
        startRecording();
    }

    );

ipcMain.on
    ('stop-recording', () => {
        stopRecording();
    }

    );
ipcMain.on
    ('convert', (event,name) => {
        console.log("🚀 ~ file: main.js:98 ~ ipcMain.on ~ name", name)
        const ffmpeg = require('ffmpeg');
        const os = require('os');

        try {
            const input = path.join(os.homedir(),"Downloads",`${name}.webm`);
            const output = path.join(os.homedir(),"Downloads",`${name}.mp4`);

            // copy past 
            fs.copyFileSync(
                input,
                path.join(os.homedir(),"Downloads",`${name}-2.webm`)
            )
            console.log("🚀 ~ file: main.js:116 ~ input:", input)

            const process = new ffmpeg(input);
            process.then((video) => {
                
                video.save(output, (error, file) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('File saved:', file);
                    }
                });
            }, (error) => {
                console.log(error);
            });
        } catch (error) {
            console.log(error);
        }
    })


   