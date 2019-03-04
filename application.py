import os
import time

from flask import Flask, flash, jsonify, render_template, request, session, abort
from flask_socketio import SocketIO, emit
from collections import deque

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

messages = {}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/channels", methods=["POST", "GET"])
def create():
    # User submits form to create a new channel
    if request.method == "POST":
        channel = request.get_json()
        
        # Check channel is a string
        if isinstance(channel,str) == False:

            #Returns http code for invalid request
            return "", 400

        # If channel does not already exist, add as a key to the messages list
        if not channel in messages:
            messages[channel] = []

            # Updates channel list via socket.io
            socketio.emit("new channel", channel, broadcast=True)

            # Returns list of channels 
            return ""

        # If channel exists, user goes to that channel but 400 returns (invalid request)
        else:
            return "", 409
   
    # If method = GET (User has not yet created a channel)
    else:
        return jsonify(list(messages.keys()))

@app.route("/messages", methods=["POST", "GET"])
def postmessage():

    # User submits message to channel
    if request.method == "POST":
        data = request.get_json()
        
        # Check message is a string
        if isinstance(data["message"], str) == False:
            return "", 400

        # Check channel exists
        if not data["channel"] in messages:
            return "", 400
        channel = data["channel"]

        messagedict = {"message": data["message"], 
            "displayname": data["displayname"], 
            "timestamp": time.time()}
        
        # Slice list from left so under 100 messages, keep newest messages
        del messages[channel][0:len(messages[channel])-100-1]
        
        # Add message to dictionary
        messages[channel].append(messagedict)

        socketio.emit(channel, messagedict, broadcast = True)
        return ""
    
    # Method is GET, (No new message has been submitted)
    else:
        channel = request.args.get("channel")
        if not channel in messages:
            return "", 404
        return jsonify(messages[channel])

@app.route("/check", methods=["GET"])
def check():
    
    # User has active channel in local storage, so check if it still exists
    channel = request.args.get("channel")
    if not channel in messages:
        return "", 204