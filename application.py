import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session, abort
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)


@app.route("/")
def index():
    
    return render_template("index.html")