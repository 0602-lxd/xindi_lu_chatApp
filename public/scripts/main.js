import ChatMessage from "./components/TheMessageComponent.js"


(() => {
    
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    function time() {
        var now = new Date;
        var h = now.getHours();
        var mm = now.getMinutes();
        h = h < 10 ? "0" + h : h;
        mm = mm < 10 ? "0" + mm : mm;
        var str;
        if(h>12) {
            h -= 12;
            str = " PM";
        }else{
            str = " AM";
        }
        return h + ':' + mm + str;
    };
    console.log(new Date());
    const socket = io();
    //The client sends a custom event to the server
    //socket.emit('broadcastEventClient', 'take care');
   
    socket.on('connected', setUserId)
    //online users
    function numbers(data) {
        console.log( data.number);
        vm.number = data.number;
    }
    // pass in data from ChatMessage.js props
    function appendNewMessage(msg) {
        // take the incoming message and push it into the Vue instance
        // into the messages array
        console.log(msg)
        vm.list.push(msg);
    }

    function setUserId({sID,}) {
        console.log('sID:'+sID)
        // debugger;
        // testing in multiple browsers, you will have different IDs
        // pass in sID into vue socketID
        vm.socketID = sID;
        console.log(sID, '(you) joined');
    }
    /* The client receives the message from the server */
    socket.on('message', (data) => {
        console.log(data);
        // debugger;
        console.log('The server returns data after sending the message')
        vm.list.push({id: data.id, username: data.username, name: data.name, message: data.message,time: data.time });
        var scrollTarget = document.querySelector('.mainbox');
        scrollTarget.scrollTop=scrollTarget.scrollHeight;
    });
    
    socket.on('number', (data) => {
        console.log(data)
        vm.number = vm.number;
        numbers(data);
    });
    const vm = new Vue({
        data: {
            list: [],
            message:"",
            username: "",
            name:"",
            socketID: "",
            number:"",//number
        },
        created: function () {
        },
        methods: {
            dispatchMessage() {
                console.log('Submit form information');
                if (this.message == '') {
                    alert('Please enter a message');
                } else {
              
                    socket.emit('chat_message', {id:this.socketID,message: this.message,name:GetQueryString("username"), username: this.username==''?GetQueryString("username"):this.username,time:time()  });
                    this.message = "";
                    this.username = "";
                    setTimeout(function () {
                        var scrollTarget = document.querySelector('.mainbox');
                        // scrollTarget.scrollTop = scrollTarget.scrollHeight;
                        scrollTarget.scrollTo(0,scrollTarget.scrollHeight)
                    },200);
                }

            }  

        },
        
        components: {
            newmessage: ChatMessage
        }
    }).$mount("#app");
    socket.addEventListener('new_message', appendNewMessage);
    socket.addEventListener('number', numbers)
})();