import React from 'react';
import * as handTrack from "handtrackjs";
import Peer from 'peerjs';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { MdContentCopy, MdClear, MdVideocam, MdVideocamOff, MdCallEnd, MdRefresh } from 'react-icons/md';
import { FaMicrophoneSlash, FaMicrophone, FaPaintBrush } from 'react-icons/fa';
// https://github.com/ourcodeworld/videochat-peerjs-example/blob/master/public/source/js/script.js
// https://www.andismith.com/blogs/2012/07/extending-getusermedia/


class GameHeader extends React.Component {

    ctrlC(e) {
        // https://stackoverflow.com/questions/56704138/i-want-to-create-a-copy-to-clipboard-using-react-js
        // copy room code to clipboard
        this.textArea.select();
        document.execCommand('copy');
        e.target.focus();
    }

    render() {
        return (
            <header style={{
                position: 'fixed',
                padding: '20px',
                background: '#17a2b8',
                color: 'white',
                fontSize: '30px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                top: '0',
                left: '0',
                right: '0',
                width: '100%',
            }}>
                {/* Title */}
                <text><span role="img" aria-label="emoji">🎉</span> Physical Comedy </text>
                {/* Room Code */}
                <div>
                    <textarea
                        readOnly={true}
                        spellCheck='false'
                        style={{
                            background: '#17a2b8',
                            color: '#17a2b8',
                            fontSize: '1px',
                            border: 'none',
                            resize: 'none',
                        }}
                        ref={(textarea) => this.textArea = textarea}
                        value={this.props.id}
                        onClick={this.ctrlC.bind(this)}
                    />
                    <text id="roomId" style={{ fontSize: '80%' }} >Room Code: {this.props.id} </text>
                    <OverlayTrigger
                        delay={{ show: 250, hide: 400 }}
                        placement='bottom'
                        overlay={
                            <Tooltip>
                                Copy to Clipboard.
                            </Tooltip>
                        }
                    >
                        <Button variant="outline-light" style={{ fontSize: '50%', }} onClick={this.ctrlC.bind(this)}><MdContentCopy /></Button>
                    </OverlayTrigger>
                </div>
                {/* Help button */}
                <OverlayTrigger
                    delay={{ show: 250, hide: 400 }}
                    placement='bottom'
                    overlay={
                        <Tooltip>
                            Need Help?
                        </Tooltip>
                    }
                >
                    <Button variant="outline-light" onClick={this.props.onClick}> Help? </Button>
                </OverlayTrigger>
            </header>
        );
    }
}

class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.localId,
            turn: props.turn,
            messageText: '',
            messages: props.messages,
        };
        this.updateScroll = this.updateScroll.bind(this);
    }

    componentDidMount() {
        this.updateScroll();
    }

    componentDidUpdate() {
        this.updateScroll();
    }

    updateScroll() {
        let element = document.getElementById("messageBoard");
        element.scrollTop = element.scrollHeight;
    }

    handleChange = event => {
        this.setState({ messageText: event.target.value });
    };

    render() {
        // return(<div></div>);
        // https://www.cometchat.com/tutorials/build-an-anonymous-chat-app-with-react-react-bootstrap/
        return (
            <div
                // className='bg-light page'
                style={{
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden'
                }}
            >
                <Col style={{ width: '100%', margin: '0px', padding: '0px' }}>
                    {/* Message log */}
                    <Container style={{ padding: '10px', marginTop: '10px' }}>
                        <div>
                            <code id="messageBoard" style={{
                                display: 'block',
                                height: '70vh',
                                overflow: 'scroll',
                                overflowX: 'hidden',
                                width: "100%",
                            }}>
                                {
                                    this.props.messages.map(msg => {
                                        switch (msg.type) {
                                            case "meta":
                                                return (<li className='list-group list-group-flush' key={msg.name}>
                                                    <text style={{ color: '#808080' }}> >>> {msg.text} </text>
                                                </li>)
                                            case "local":
                                                return (<li className='list-group list-group-flush' key={msg.name}>
                                                    <text style={{ color: '#17b87e' }}> <strong>{msg.name}</strong>: {msg.text} </text>
                                                </li>)
                                            case "peer":
                                                return (<li className='list-group list-group-flush' key={msg.name}>
                                                    <text style={{ color: '#17a2b8' }}> <strong>{msg.name}</strong>: {msg.text} </text>
                                                </li>)
                                            default:
                                                return (<li className='list-group list-group-flush' key={msg.name}>
                                                    <text style={{ color: '#17a2b8' }}> <strong>{msg.name}</strong>: {msg.text} </text>
                                                </li>)
                                        }
                                    }
                                    )
                                }
                            </code>
                        </div>
                    </Container>
                    {/* Message Submit */}
                    <Container id='messageForm' style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <Form
                            inline
                            onSubmit={(e) => {
                                e.preventDefault();
                                this.setState({
                                    messageText: ''
                                })
                                this.props.onClick(this.state.messageText)
                            }}
                        // style={{display: 'flex',  justifyContent: 'space-between', alignContent: 'stretch'}}
                        >
                            <Form.Group style={{ flex: 1 }}>

                                {
                                    this.props.turn ?
                                        (
                                            <Form.Control
                                                value={this.state.messageText}
                                                style={{ width: '100%' }}
                                                required
                                                type='text'
                                                placeholder='Type here...'
                                                onChange={this.handleChange}
                                                disabled='true'
                                            />
                                        ) : (
                                            <Form.Control
                                                value={this.state.messageText}
                                                style={{ width: '100%' }}
                                                required
                                                type='text'
                                                placeholder='Type here...'
                                                onChange={this.handleChange}
                                            />
                                        )
                                }
                            </Form.Group>
                            {/* <Button variant="info" type='submit'> Send </Button> */}

                        </Form>
                    </Container>

                </Col>
            </div >
        );
    }
}

function PeerVideo(props) {
    return (
        <video id={props.id} width="100" height="100" autoPlay="autoplay" className="mx-auto d-block" style={{ margin: '10px 10px', width: 'auto', }} /*onClick={props.onClick}*/></video>
    );
}

class Streams extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            localId: props.localId,
            localName: props.localName,
            localStream: props.localStream,
            mute: props.mute,
            camOn: props.camOn,
            deafen: props.deafen,
            myPeers: props.myPeers
        };
        // TODO: mute, deafen, camOn, peers
    }

    renderPeerVideo(peerName) {
        return (
            <PeerVideo
                id={peerName}
            // onClick={() => this.handleCanvasClick(peerName)}
            />
        );
    }

    render() {
        return (
            <Container style={{
                overflow: 'hidden', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignContent: 'center', /*alignItems: 'center',*/
                height: 'inherit',
            }}>
                <video id="my-camera" width="auto" height="225" autoPlay="autoplay" muted={true} /*className="mx-auto d-block"*/></video>
                <canvas id="feed" ></canvas>
                <video id="peer-camera" width="50%" height="225" autoPlay="autoplay" /*className="mx-auto d-block"*/></video>
                {/* <div id="peers">
                    {this.state.myPeers.map((peer) => (
                        <div key={peer.id}>
                            {this.renderPeerVideo(peer.name)}
                        </div>
                    ))}
                </div> */}
            </Container>
        );
    }
}

class CallOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    // if on, show off, if off, show on
                    overlay={<Tooltip>Camera {this.props.camOn ? "On" : "Off"}</Tooltip>}>
                    {this.props.camOn ?
                        // on
                        <Button variant="info" onClick={this.props.toggleCam} size="lg" >
                            <MdVideocam />
                        </Button>
                        :
                        // off
                        <Button variant="outline-secondary" onClick={this.props.toggleCam} size="lg" >
                            <MdVideocamOff />
                        </Button>
                    }

                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    // if on, show off, if off, show on
                    overlay={<Tooltip>{this.props.muted ? "Muted" : "UnMuted"}</Tooltip>}>
                    {this.props.muted ?
                        // off
                        <Button variant="outline-secondary" onClick={this.props.toggleMute} size="lg" >
                            <FaMicrophoneSlash />
                        </Button>
                        :
                        // on
                        <Button variant="info" onClick={this.props.toggleMute} size="lg" >
                            <FaMicrophone />
                        </Button>
                    }

                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    // if on, show off, if off, show on
                    overlay={<Tooltip>End {this.props.hosting ? "Room" : "Call"}</Tooltip>}>
                    <Button variant="danger" onClick={this.props.hosting ? this.props.endRoom : this.props.endCall} size="lg" >
                        <MdCallEnd />
                    </Button>
                </OverlayTrigger>
            </div>
        );
    }
}

class GameOptions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    // if on, show off, if off, show on
                    overlay={<Tooltip>Paint Mode {this.props.paintOn ? "On" : "Off"}</Tooltip>}>
                    {this.props.paintOn ?
                        // on
                        <Button variant="info" onClick={this.props.toggleDraw} size="lg" >
                            <FaPaintBrush />
                        </Button>
                        :
                        // off
                        <Button variant="outline-secondary" onClick={this.props.toggleDraw} size="lg" >
                            <FaPaintBrush />
                        </Button>
                    }

                </OverlayTrigger>
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip>Get Another Word</Tooltip>}>
                    <Button variant="outline-info" id="wordbutton" onClick={this.props.newWord} size="lg" ><MdRefresh /></Button>
                </OverlayTrigger>
            </div>
        );
    }
}

class Room extends React.Component {
    constructor() {
        super();
        // WHEN STATE CHANGES, THE COMPONENT RERENDER, SO BE CAREFUL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
        this.state = {
            // peerjs
            localId: '',
            localName: '',
            hosting: false,
            // handtrackjs
            modelParams: {
                flipHorizontal: true,   // flip e.g for video  
                maxNumBoxes: 1,        // maximum number of boxes to detect
                iouThreshold: 0.5,      // ioU threshold for non-max suppression
                scoreThreshold: 0.9,    // confidence threshold for predictions.
            },
            model: null,
            modelLoaded: false,
            doodlecolor: "#17a2b8",
            savedlines: [],
        };

        // Objects used by composite components
        this.mediaConnection = null;
        this.dataConnection = null;
        this.localStream = null;
        this.canvasStream = null;
        // TODO: move this into the myPeers object 
        this.peer_mediaConnection = null;

        this.messages = [
            {
                name: "",
                type: "meta",
                text: "Write your guess here or just send messages to your mates!",
            }
        ];

        this.myPeers = [
            // {
            //     peerId: '',
            //     name: '',
            //     call: null,
            //     dataConnection: null,
            //     mediaConnection: null,
            //     stream: null
            // },
        ];

        this.muted = true;
        this.camOn = false;
        this.paintOn = false;
        this.nxpos = 0;
        this.nypos = 0;

        // Function binding

        // make peer 
        this.peer = new Peer();
        console.log("Current", this.peer);
    }

    componentDidMount() {
        // create room open connection
        // on join, get message asking if allow
        // if allow: add to peerlist [end] & send all peers peerlist/streams

        // If host: 'end room' 
        // send everyone empty list & clone connection
        // new peer
        // new connection


        let video = document.getElementById('peer-camera');
        video.style.display = 'none';

        this.nxpos = 300 / 2;
        this.nypos = 225 / 2;


        // load handtrack model
        console.log("loading model...");
        handTrack.load(this.state.modelParams).then(loadedModel => {
            this.setState({ model: loadedModel });
            this.setState({ modelLoaded: true });
            console.log("model loaded", this.state.model);
        });


        // set up peer connection to the SERVER
        this.peer.on('open', (localId) => {
            console.log("peer id", localId);
            this.setState({
                localId: localId,
                localName: localId,
                hosting: false,
            });
        });

        // generic error handling TODO: Clarify!!!
        this.peer.on('error', (err) => {
            alert("An error ocurred with peer: " + err);
            console.error(err);
        });

        // Handle the on receive connection event
        // TODO: set conn to list
        // REF:
        // peer.on('connection', (dataConnection) => {
        //     // Emitted when the connection is established and ready-to-use. 
        //     dataConnection.on('open', () => {
        //         // Emitted when data is received from the remote peer.
        //         dataConnection.on('data', (data) => {
        //             console.log('Received', data);
        //         });
        //         // Send messages [is serialized by BinaryPack by default and sent to the remote peer]
        //         dataConnection.send('Hello!');
        //     });
        //     // Closes the data connection gracefully, cleaning up underlying DataChannels and PeerConnections.
        //     dataConnection.close();
        // });

        // handle the on receive call event
        this.peer.on('call', (mediaConnection) => {
            this.mediaConnection = mediaConnection;

            // TODO: remove toggle and clean up behavior
            this.camOn = false;
            this.toggleCam();

            // TODO: reject call functionality: make connection, send username, add id to list, make call, accept call if on list
            // let acceptsCall = confirm("Videocall incoming, do you want to accept it ?");
            let acceptsCall = true;


            if (acceptsCall) {
                // Answer the call with your own video/audio stream
                let video = document.getElementById('peer-camera');
                video.style.display = 'inline-block';
                mediaConnection.answer(this.canvasStream);

                // Emitted when a remote peer adds a stream
                mediaConnection.on('stream', (mediaConnection) => {
                    // Store a global reference of the other user stream
                    this.peer_mediaConnection = mediaConnection;
                    // Display the stream of the other user in the peer-camera video element
                    this.onReceiveStream(mediaConnection, 'peer-camera');
                });

                // Handle when a remote peer ends the call
                mediaConnection.on('close', () => {
                    // TODO: on close, remove from peer list
                    alert("The videocall has finished");
                    let video = document.getElementById('peer-camera');
                    video.style.display = 'none';
                    this.peer_mediaConnection = null;
                    this.endCall();
                });

                // // Closes the data connection gracefully, cleaning up underlying DataChannels and PeerConnections.
                // mediaConnection.close();
            } else {
                console.log("Call denied !");
            }
        });

        // make connection to another peer
        // REF:
        // let conn = this.peer.connect(this.state.value, {
        //     metadata: {
        //         'username': username
        //     }
        // });
        // conn.on('data', handleMessage());

        // make call to another peer

    }

    endRoom() {
        //TODO
    }

    endCall() {
        //TODO
        this.onEndStream('peer-camera');
        if (this.call) {
            this.call.close();
        }// this.peer_mediaConnection.getTracks().forEach((track) => {
        //     track.stop();
        // });
    }

    // Handle the providen stream (video and audio) to the desired video element
    onReceiveStream(stream, element_id) {
        // Retrieve the video element according to the desired
        let video = document.getElementById(element_id);
        // Set the given stream as the video source
        // video.src = window.URL.createObjectURL(stream);
        console.log('stream', stream);
        video.srcObject = stream;
        // TODO: change this to =>
        video.onloadedmetadata = function (e) {
            video.play();
        };
    }

    // feedback loop of getting cam stream from hidden video and applying to canvas on sceen
    streamFeed() {
        // TODO: Move these around to global variables after component mounts
        let feed = document.getElementById('feed');
        let context = feed.getContext('2d');
        let video = document.getElementById('my-camera');
        feed.width = video.width;
        feed.height = video.height;
        video.style.display = 'none';
        this.canvasStream = feed.captureStream();

        context.drawImage(video, 0, 0, feed.width, feed.height);

        window.requestAnimationFrame(() => {
            if (this.paintOn) {
                let video = document.getElementById('my-camera');
                this.runDetection(video);
                // let feed = document.getElementById('feed');
                // this.runDetection(feed);
            } else {
                this.streamFeed();
            }
        });
        // context.drawImage(video, 0, 0);
    }

    // Starts the request of the camera and microphone
    requestLocalVideo() {
        console.log('requesting video');
        // // Monkeypatch for crossbrowser geusermedia
        // navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // // Request audio an video
        // navigator.getUserMedia({ audio: true, video: true }, callbacks.success, callbacks.error);

        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = (constraints) => {

                // First get ahold of the legacy getUserMedia, if present
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }

        // set video to canvas on screen
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
            this.localStream = stream;
            this.onReceiveStream(stream, 'my-camera');
            this.streamFeed();
        }).catch((err) => {
            alert("Cannot get access to your camera and video !");
            console.error(err);

        })
    }

    // when any call stream is to be removed from the screen
    onEndStream(element_id) {
        // Retrieve the video element according to the desired
        let video = document.getElementById(element_id);
        // Set the given stream as the video source
        // video.src = window.URL.createObjectURL(stream);
        video.srcObject = null;

        // Store a global reference of the stream
        // TODO: abstract this to peers list
        this.peer_mediaConnection = null;

    }

    toggleCam() {
        if (this.camOn) {
            // turning off
            this.camOn = false;
            this.onEndStream('my-camera');
            this.localStream.getTracks().forEach((track) => {
                track.stop();
            });
            console.log('this.localStream', this.localStream);
        } else {
            // turning on
            this.camOn = true;
            this.requestLocalVideo();
        }
    }

    // provides a list of hand position predicitons from a source
    runDetection(input) {
        // TODO: abstract these
        let feed = document.getElementById('feed');
        let video = document.getElementById('my-camera');
        let context = feed.getContext('2d');
        this.state.model.detect(input).then(predictions => {
            //   if (predictions[0]) {
            //     let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            //     console.log('Predictions: ', inputsource.width, midval / inputsource.width);

            //   }
            // if (this.canvas.current) {
            context.drawImage(video, 0, 0, feed.width, feed.height);
            this.runDrawPredictions(predictions);
            // console.log("FPS", this.state.model.getFPS())
            // $("#fps").text("FPS: " + model.getFPS())
            window.requestAnimationFrame(() => {
                if (this.paintOn) {
                    let video = document.getElementById('my-camera');

                    this.drawDoodle(context);

                    this.runDetection(video);
                    // let feed = document.getElementById('feed');
                    // this.runDetection(feed);
                } else {
                    this.streamFeed();
                }
            });
            // if (this.paintOn && this.canvasStream) {
            //     window.requestAnimationFrame(function () {
            //         this.runDetection();
            //     });
            // }
            // }

        });
    }

    runDrawPredictions(predictions) {
        let feed = document.getElementById('feed');
        let canvasContext = feed.getContext('2d');
        // canvasContext.clearRect(0, 0, feed.width, feed.height);
        canvasContext.save();
        // if (state.modelParams.flipHorizontal) {
        // canvasContext.scale(-1, 1);
        // canvasContext.translate(-feed.width, 0);
        // }
        canvasContext.restore();

        console.log('number of detections: ', predictions.length);
        for (let i = 0; i < predictions.length; i++) {
            // xpos = this.nxpos;
            // ypos = this.nypos;
            this.nxpos = predictions[i].bbox[0] + (predictions[i].bbox[2] / 2);
            this.nypos = predictions[i].bbox[1] + (predictions[i].bbox[3] / 2);
            // this.drawDoodle(canvasContext);
        }
    }

    drawDoodle(canvasContext) {
        let newLines = this.state.savedlines;
        // nxpos = 300 - nxpos;
        newLines.push({ xpos: 300 - this.nxpos, ypos: this.nypos });
        this.setState({ savedlines: newLines });
        console.log("newLine", newLines);
        for (let i = 1; i < newLines.length; i++) {
            // console.log("newLine", newLine);
            canvasContext.beginPath(); // begin
            canvasContext.lineWidth = 5;
            canvasContext.lineCap = 'round';
            canvasContext.strokeStyle = this.state.doodlecolor;
            canvasContext.moveTo(newLines[i - 1].xpos, newLines[i - 1].ypos); // from

            canvasContext.lineTo(newLines[i].xpos, newLines[i].ypos); // to
            canvasContext.stroke(); // draw it!
            canvasContext.closePath();
        }
    }

    // toggle gesture detection doodling on canvas
    toggleDraw() {
        this.setState({ savedlines: [] });
        if (this.paintOn) {
            this.paintOn = false;
            // this.streamFeed();
            // handTrack.stopVideo()
        } else {
            this.paintOn = true;

            // let feed = document.getElementById('feed');
            // let context = feed.getContext('2d');
            // context.clearRect(0, 0, feed.width, feed.height);


            // handTrack.startVideo(this.video.current).then(function (status) {
            // if (status) {
            // self.setState({ videoPlayStatus: true })
            // this.runDetection();
            // } else {
            // console.log("Camera not available")
            // self.setState({ highlightText: "Please enable camera to use video detection" })
            // self.setState({ showHighlight: true })
            // setTimeout(() => {
            // self.setState({ showHighlight: false })
            // }, 6000);
            // }
            // })
        }
    }

    sendMessage(message) {
        //TODO: add to messagelist and send to all other users
        console.log('message', message);
        this.messages.push({ name: this.state.localId, type: "local", text: message })
    }

    newWord() {
        //TODO: datamuse API
    }

    toggleMute() {
        //TODO: mute toggle
    }

    // https://getbootstrap.com/docs/4.4/utilities/position/
    render() {
        return (
            <div style={{
                position: 'absolute',
                top: 0, right: 0, bottom: 0, left: 0,
            }}>
                <GameHeader
                    id={this.state.localId}
                />
                <div id="body" className='bg-light page' style={{
                    display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                    marginTop: '89px',
                    // marginBottom: '85px',
                    // position: 'absolute',
                    // top: 0, right: 0, bottom: 0, left: 0,
                }}>
                    <div id="left" style={{ display: 'flex', alignItems: 'stretch', flexBasis: '20%', maxWidth: '20%' }}>
                        <ChatBox
                            // TODO: When peerlist update, send message to chat
                            onClick={this.sendMessage.bind(this)}
                            messages={this.messages}
                        />
                    </div>
                    <div id="right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexBasis: '80%', maxWidth: '80%' }}>
                        <div id='top' style={{ display: 'flex', height: '75vh', flexBasis: '80%', maxWidth: '100%', }}>
                            <Streams
                                localId={this.state.localId}
                                localName={this.state.localName}
                                localStream={this.state.localStream}
                                myPeers={this.myPeers}
                            />
                        </div>
                        <div id="bottom" style={{
                            display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', justifyItems: 'center', alignItems: 'center',
                            flexBasis: '20%', width: '100%', height: '100%'
                        }}>
                            <CallOptions
                                hosting={this.state.hosting}
                                // TODO: add these
                                endRoom={this.endRoom.bind(this)}
                                endCall={this.endCall.bind(this)}
                                muted={this.muted}
                                toggleMute={this.toggleMute.bind(this)}
                                camOn={this.camOn}
                                toggleCam={this.toggleCam.bind(this)}
                            />
                            <GameOptions
                                // TODO: add word somewhere in layout
                                paintOn={this.paintOn}
                                newWord={this.newWord.bind(this)}
                                toggleDraw={this.toggleDraw.bind(this)}
                            />

                        </div>
                    </div>
                </div>
            </ div>
        );
    }
}

export default Room;
