# Project 2

Web Programming with Python and JavaScript
//application.py//
All the server-side functions. Stores upto a hundred message per channel. emits new channels and messages to open sockets.

//index.js//
Client-side functions. Determines how the webpage should be rendered based on whether the user has visited before. Opens sockets to list for new messages and new channels.

//index.html///
The only html file that is rendered for the project. Content is hidden or displayed

//How the project meets the brief//
//Display name//
Display name is stored in local storage. if there is nothing in local storage variable "displayname", the form for chosing a display name is made visible. Otherwise, it is hidden. See index.js "FirstTime", line 173.

If there is a value for the local variable "displayname" (ie, if the user has visited the page before), the user is shown the last channel visited and a list of all channels, and the form for creating new channels. See index.js "SecondTime", line 206.

//Channel Creation//
Users can create channels. These are stored in a dictionary as keys server-side. (see application.py line 14 and line 21) ). If a user attempts to create a channel that already exists, they are directed to the existing channel.

//Channel list//
The Channel list is stored in a variable server side, but new channels are emitted via socketio.emit so that lists are updated for all clients. The list is displayed by clicking on a button at the top of the page in the navbar.

//Messages view//
Messages are stored in a dictionary on the serverside, "messages" and accessed via the channel name (which is the dictinary key). Only 100 messages are stored (see application.py line 71). When a user selects a channel, the list of messages is loaded from the server (index.js line 102 and application.py line 48).

//Sending messages//
Form for sending messages in enabled when a user has selected a channel. All messages that have been sent are displayed with the username, message and time-date stamp. The date is published as per the user's local settings. (see index.js 148-151). When a user has selected a channel, a socket is opened to list for new messages, which are then emitted by the server.

//Remembering the channel//
When a user choses a channel, it is stored in local storage variabel "activechannel". Only the most recently visited channel is remembered in local storage. When the user visits the page, the channel's messages are retrieved and displayed (see index.js, line 213).

//Personal Touch//
(1) If you open up FLACK and it remembers a user that isn't you, you can say, 'that's not me' and chose a new user name. (2) The display is built to be mobile-responsive so that the conversations get the most realestate on the screen (rather than the channel list).


