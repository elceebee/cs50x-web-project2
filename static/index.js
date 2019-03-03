let activechannel;
var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
const EnableDisplayNameButton = () => {
    if (document.querySelector('#displayname').value.length < 2) {
        document.querySelector('#choosedisplay').disabled = true;
    }
    else {
        document.querySelector('#choosedisplay').disabled = false;
    }
}
const EnableCreateChannelButton = () => {
    if (document.querySelector('#Channelname').value.length < 2) {
        document.querySelector('#createChannelButton').disabled = true;
    }
    else {
        document.querySelector('#createChannelButton').disabled = false;
    }
}
const EnableMessageButton = () => {
    if (document.querySelector('#messageText').value.length < 2) {
        document.querySelector('#createMessageButton').disabled = true;
    }
    else {
        document.querySelector('#createMessageButton').disabled = false;
    }
}
const CreateNewChannel = () => {         
    // Initialise new channel request
    const requestNewChannel = new XMLHttpRequest();
    const newChannel = document.querySelector('#Channelname').value;
    requestNewChannel.open('POST', '/channels');
    requestNewChannel.setRequestHeader("content-type", "application/json");

    // Callback funciton for when request completes
    requestNewChannel.onload = () => {

        // Check for error messsages from server
        if (requestNewChannel.status == 409 || requestNewChannel.status == 200) {
            SwitchChannel(newChannel);
        }
        else {
            // Show user error message
        }
             
    }
    // Clear input field and disable button again
    document.querySelector('#Channelname').value = '';
    document.querySelector('#createChannelButton').disabled = true;

    // Send request
    requestNewChannel.send(JSON.stringify(newChannel));
    return false;
}
const SendMessage = () => {

    // Initialise new message request
    const requestNewMessage = new XMLHttpRequest();
    const newMessage = document.querySelector('#messageText').value;
    const displayname = localStorage.getItem("displayname");
    const channel = localStorage.getItem('activechannel');
    requestNewMessage.open('POST', '/messages');
    requestNewMessage.setRequestHeader("content-type", "application/json");

    // Callback function for when request completes
    requestNewMessage.onload = () => {

        // Check for error mesages from server
        if (requestNewMessage.status == 400) {
            userMessage = "Channel does not exist or you have entered an invalid message"
        }
    }
    // Clear input field and disable button again
    document.querySelector('#messageText').value = '';
    document.querySelector('#createMessageButton').disabled = true;

    // Send request
    NewMessageDict = {
        "message": newMessage,
        "displayname": displayname,
        "channel": channel
    }
    requestNewMessage.send(JSON.stringify(NewMessageDict));
    return false;
}
const SwitchChannel = (channel) => {
    // Stop listening for messages from old channel
    if (localStorage.getItem("activechannel")) {
        socket.off(localStorage.getItem("activechannel"))
    } 
    // Clear messages from screen
    document.querySelector('#messagesList').innerHTML = "";
    
    // Load messages from server for this channel
    const requestMessages = new XMLHttpRequest();
    requestMessages.open('GET', `/messages?channel=${channel}`);

    requestMessages.onload = () => {
        if (requestMessages.status == 404) {
            return
        }
        const messages = JSON.parse(requestMessages.responseText);
        for (x in messages) {
            renderMessage(messages[x])
        }
    }
    requestMessages.send();

    // Store channel name in local storage
    localStorage.setItem('activechannel', channel);
    
    // Adds active channel to DOM
        const discussionTopic = Handlebars.compile("Discussion: {{ activechannel }}");
        const topic = discussionTopic({'activechannel': channel});
        document.querySelector('#active').innerHTML = topic;

    // Start listening for message for this channel
        socket.on(channel, NewMessageText => {
            renderMessage(NewMessageText)
        });
}
const renderMessage = (message) => {
    const Messageli = document.createElement('li');
    Messageli.innerHTML = `${message.message} ${message.displayname} ${message.timestamp}`;
    document.querySelector('#messagesList').append(Messageli);
} 

const renderChannel = (channel) => {
    const Channelli = document.createElement('li');
    Channelli.innerHTML = `${channel}`;
    document.querySelector('#channelList').append(Channelli);

} 

const FirstTime = () => {
    // Disable welcomeback div
    document.getElementById('welcomeback').style.display = "none";

    // Disable channel creation div
    document.getElementById('createChannel').style.display = "none";

    // Disable channel list
    document.getElementById('allChannels').style.display = "none";

    // Disable active channel
    document.getElementById('activeChannel').style.display = "none";
    
    // By default the submit button is disabled
    document.querySelector('#choosedisplay').disabled = true;
    
    // Enable button only if there is text in the input field
    document.querySelector('#displayname').onkeyup = EnableDisplayNameButton;  

    // When user submits a display name, it's stored in local storage
    document.querySelector('#chooseform').onsubmit = () => {
        
        // Sets display name for browser
        const displayname = document.querySelector('#displayname').value;
        
        // Stores displayname in local storage    
        localStorage.setItem('displayname', displayname);

        SecondTime();
    
    };

}
const SecondTime = () => {
    // Disable choose display name div
    document.getElementById('choose').style.display = "none";

    // Retreives displayname
    const displayname = localStorage.getItem('displayname');

    // Retreives last active channel
    if (localStorage.getItem('activechannel')) {
        SwitchChannel(localStorage.getItem('activechannel'))
    }

    // Adds welcome message to DOM
    const welcome = Handlebars.compile("<h1>Welcome {{ displayname }}</h1>");
    const content = welcome({'displayname': displayname});
    document.querySelector('#welcomeback').innerHTML = content;

    // Adds channel list to DOM
    const requestChannels = new XMLHttpRequest();
    requestChannels.open('GET', '/channels');

    requestChannels.onload = () => {
        const channels = JSON.parse(requestChannels.responseText);
        for (x in channels) {
            renderChannel(channels[x])
        }
    }
    
    // Sends request for channels list
    requestChannels.send();

    // When a new channel is created, add to the unordered list
    socket.on('new channel', NewChannelName => {
        renderChannel(NewChannelName)
    });

    // Creating a new channel
    // Set up button: by default the create channel button is disabled
    document.querySelector('#createChannelButton').disabled = true;
    
    // Enable button only if there is text in the input field
    document.querySelector('#Channelname').onkeyup = EnableCreateChannelButton;

    // Create channel
    document.querySelector('#createChannel').onsubmit = CreateNewChannel;

    // Create a new message
    // Set up button: by default the new message button is disabled
    document.querySelector('#createMessageButton').disabled = true;

    // Enable button only if there is text in the input field
    document.querySelector('#messageText').onkeyup = EnableMessageButton;

    // Create message
    document.querySelector('#createMessage').onsubmit = SendMessage;
}

document.addEventListener('DOMContentLoaded', () => {
            
    // First-time visit to Flack
    if (!localStorage.getItem('displayname')) { 
        FirstTime();
    }
    
    // User has visited the site before
    else {
        SecondTime();
    }
});    




/*Enhancements
Change order of channel list so that most recent is on top
Load messages when refresh*/
