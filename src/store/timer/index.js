const {desktopCapturer} = window.require('electron')
const fs = window.require('fs');
import axios from 'axios'
export default{
    namespaced:true,
    state:{
        hours:0,
        minutes:0,
        seconds:0,
        online:navigator.onLine,
        trackingOn:false,
        image:null,
    },
    getters:{

    },
    mutations:{
        SET_HOURS(state,payload){
            state.hours = payload
        },
        SET_MINUTES(state,payload){
            state.minutes = payload
        },
        SET_SECONDS(state,payload){
            state.seconds = payload
        },
        SET_ONLINE(state,payload){
            state.online = payload
        }
    },
    actions:{
        fullscreenScreenshot({state},imageFormat) {
            var _this = this;
            imageFormat = imageFormat || 'image/jpeg';
            
            this.handleStream = (stream) => {
                // Create hidden video tag
                var video = document.createElement('video');
                video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
          
                
                
                // Event connected to stream
                video.onloadedmetadata = ()=>{
                    // Set video ORIGINAL height (screenshot)
                    video.style.height = this.videoHeight + 'px'; // videoHeight
                    video.style.width = this.videoWidth + 'px'; // videoWidth
          
                    video.play();
          
                    // Create canvas
                    var canvas = document.createElement('canvas');
                    canvas.width = this.videoWidth;
                    canvas.height = this.videoHeight;
                    var ctx = canvas.getContext('2d');
                    // Draw video on canvas
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    state.image = canvas.toDataURL(imageFormat)
                    this.dispatch('timer/saveScreenshot',state.image)
                 
          
                    // Remove hidden video tag
                    video.remove();
                    try {
                        // Destroy connect to stream
                        stream.getTracks()[0].stop();
                    } catch (e) {console.log(e)}
                }
                
                video.srcObject = stream;
                document.body.appendChild(video);
            };
          
            this.handleError = function(e) {
                console.log(e);
            };
          
            desktopCapturer.getSources({ types: ['window', 'screen'] }).then(async sources => {
                // console.log(sources);
                
                for (const source of sources) {
                    // Filter: main screen
                    if ((source.name === "Entire Screen") || (source.name === "Screen 1") || (source.name === "Screen 2")) {
                        try{
                            const stream = await navigator.mediaDevices.getUserMedia({
                                audio: false,
                                video: {
                                    mandatory: {
                                        chromeMediaSource: 'desktop',
                                        chromeMediaSourceId: source.id,
                                        minWidth: 1280,
                                        maxWidth: 4000,
                                        minHeight: 720,
                                        maxHeight: 4000
                                    }
                                }
                            });
                            _this.handleStream(stream);
                            console.log(stream)
                          
                        } catch (e) {
                            _this.handleError(e);
                        }
                    }
                }
            });
          },
          saveScreenshot({state},image){
            const config = {
                headers: {
                  'content-type': 'multipart/form-data',
                }
            }
              const data = new FormData()
              data.append('image',image)
                if(state.online){
                axios.post('',data,config).then(res=>{
                    console.log(res)
                })
            }else{
                var base64Data = image.replace(/^data:image\/png;base64,/, "");
                fs.writeFile("out.png", base64Data, 'base64', function(err) {
                  console.log(err);
            })

          }
        }
    }
}