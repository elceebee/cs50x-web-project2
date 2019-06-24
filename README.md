# Flack Messaging Service

This is an instant messaging service using Socket.IO technology. The front end is written in JavaScript (ES6), the back end is written in Python. Local storage is used to remember user preferences such as last chat room visited and username.

## Technologies used

- Python
- JavaScript (ES6)
- Flask
- Socket.IO

## Approach

Users can create chat rooms and add messages. Messages and rooms are emitted via Socket.IO for real-time conversations between users.

- See Python code which alerts the front end when channels are added: [application.py#L36](https://github.com/elceebee/cs50x-web-project2/blob/4d958fc7e9d9cf30566db2b18c04176deddcc761/application.py#L36) and when messages are sent: [application.py#L76](https://github.com/elceebee/cs50x-web-project2/blob/4d958fc7e9d9cf30566db2b18c04176deddcc761/application.py#L76)

- See JavaScript front-end which listens for udpates to channel lists here: [static/index.js#L260](https://github.com/elceebee/cs50x-web-project2/blob/4d958fc7e9d9cf30566db2b18c04176deddcc761/static/index.js#L260)and new messages depending on what channel is active here: [static/index.js#L125](https://github.com/elceebee/cs50x-web-project2/blob/4d958fc7e9d9cf30566db2b18c04176deddcc761/static/index.js#L125)

- Information about the user is stored in local storage. For instance, if a user switches channels, the information is updated in local storage. See: [static/index.js#L93](https://github.com/elceebee/cs50x-web-project2/blob/4d958fc7e9d9cf30566db2b18c04176deddcc761/static/index.js#L93)

## Next steps

- Refactor JavaScript functions for easier editing and updating.
