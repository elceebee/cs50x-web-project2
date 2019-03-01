import os

from flask import Flask, flash, jsonify, render_template, request, session, abort
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = []

@app.route("/")
def index():
    return render_template("index.html", channels = channels)

#@app.route("/create", methods=["POST", "GET"])

#def create():
#    
    # User submits form to create a new channel
#    if request.method == "POST":
#        # Ensures form had some text
#        if not request.form.get("newChannel"):
#            apology = "noChannel"
#            return render_template("index.html", channels = channels, APOLOGY = apology)
#       else: 
#            channel = request.form.get("newChannel")
#            
#            # If channel does not already exist, add to channel list
#            if channels.count(channel) == 0:
#                channels.insert(0, channel)
#                return render_template("channel.html", channels = channels)
#            else:
#                apology = "alreadyExists"
#                return render_template("index.html", channels = channels, APOLOGY = apology)
    
#    # User has not submitted a form
#    else:
#        return render_template("index.html", channels=channels)

@socketio.on("create channel")
def create(data):
    channel = data["newChannel"]
    if channels.count(channel) == 0:
        channels.insert(0, channel)
        emit("channel list", channels, broadcast=True)
    else:
        apology = "alreadyExists"
        return render_template("index.html", channels = channels, APOLOGY = apology)