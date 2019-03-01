document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {

        // On submit, the button will create a new channel
        document.querySelector('#createChannel') => {
            button.onclick = () => {
                const channel = button.dataset.channel;
                socket.emit('create channel', {'channel': channel});
            };
        };
    });

    // Stores channel name in local storage
    document.querySelector('#createChannel').onsubmit = () => {
        
        const newChannel = document.querySelector('#newChannel').value;
        localStorage.setItem('newChannel', newChannel);
    }
    
    // When a new channel is created, add to the unordered list
    socket.on('channel list', data => {
        const li = document.createElement('li');
        li.innerHTML = `${data.newChannel}`;
        document.querySelector('#channelList').append(li);
    });
});