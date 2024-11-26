import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Chat from "../pages/Chat";


import { io } from 'socket.io-client'

import Peer from 'simple-peer'

const ChatContext = createContext();
const socket = io('https://chatbox-production-08a4.up.railway.app')

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();

  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);

  const [status, setStatus] = useState();

  const history = useHistory();
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");
  }, [history]);




  const [stream, setStream] = useState(null)
  const [me, setMe] = useState('')
  const [call, setCall] = useState({})

  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)
  const [name, setName] = useState('')

  const myVideo = useRef()
  const userVideo = useRef()
  const connectionRef = useRef()


  useEffect(() => {


    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {

        setStream(currentStream);


        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;

        }
        else { console.log("no sepudo") }

      });
    socket.on('me', (id) => setMe(id))

    socket.on('calluser', ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal })
    })



  }, [me])

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({ initiator: false, trickle: false, stream })

    peer.on('signal', (data) => {
      socket.emit('answercall', { signal: data, to: call.from })
    })

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream
    })

    peer.signal(call.signal)
    connectionRef.current = peer

  }

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream })

    peer.on('signal', (data) => {
      socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
    })

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream
    })

    socket.on('callaccepted', (signal) => {
      setCallAccepted(true)

      peer.signal(signal)
    })
    connectionRef.current = peer


  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }



  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        status,
        setStatus,
        setChats,
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,

      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};



// const SocketContext = createContext()




// const ContextProvider = ({ children }) => {

//   const [stream, setStream] = useState(null)
//   const [me, setMe] = useState('')
//   const [call, setCall] = useState({})

//   const [callAccepted, setCallAccepted] = useState(false)
//   const [callEnded, setCallEnded] = useState(false)
//   const [name, setName] = useState('')

//   const myVideo = useRef()
//   const userVideo = useRef()
//   const connectionRef = useRef()


//   useEffect(() => {
//     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
//       .then((currentStream) => {
//         setStream(currentStream);
//         myVideo.current.srcObject = currentStream
//       })
//     socket.on('me', (id) => setMe(id))

//     socket.on('calluser', ({ from, name: callerName, signal }) => {
//       setCall({ isReceivedCall: true, from, name: callerName, signal })
//     })
//   }, [])

//   const answerCall = () => {
//     setCallAccepted(true)
//     const peer = new Peer({ initiator: false, trickle: false, stream })

//     peer.on('signal', (data) => {
//       socket.emit('answercall', { signal: data, to: call.from })
//     })

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream
//     })

//     peer.signal(call.signal)
//     connectionRef.current = peer

//   }

//   const callUser = (id) => {
//     const peer = new Peer({ initiator: true, trickle: false, stream })

//     peer.on('signal', (data) => {
//       socket.emit('calluser', { userToCall: id, ignalData: data, from: me, name })
//     })

//     peer.on('stream', (currentStream) => {
//       userVideo.current.srcObject = currentStream
//     })

//     socket.on('callaccepted', (signal) => {
//       setCallAccepted(true)

//       peer.signal(signal)
//     })
//     connectionRef.current = peer


//   }

//   const leaveCall = () => {
//     setCallEnded(true)
//     connectionRef.current.destroy()
//   }

//   return (
//     <SocketContext.Provider value={{
//       call,
//       callAccepted,
//       myVideo,
//       userVideo,
//       stream,
//       name,
//       setName,
//       callEnded,
//       me,
//       callUser,
//       leaveCall,
//       answerCall,


//     }}>
//       {children}

//     </SocketContext.Provider>
//   )
// }

export { ChatProvider, ChatContext }


