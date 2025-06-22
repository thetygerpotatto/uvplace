
import functools
import json

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from flaskr.db import get_db
from flaskr.auth import login_required

from flask_socketio import emit

bp = Blueprint('game', __name__)

socketio = None

@bp.route("/")
def index():
    db = get_db()

    return render_template("game/index.html")

@bp.route("/map")
def get_map():
    db = get_db()
    mapList = db.execute('SELECT cordx, cordy, color from map').fetchall()
    map = {"map" : [[0 for _ in range(100)] for _ in range(100)]}
    for cell in mapList:
        map["map"][cell["cordx"]][cell["cordy"]] = cell["color"]
    return json.dumps(map)

@bp.route("/update", methods = ["POST", "GET"])
def update_map():
    db = get_db()
    if (request.method == "POST"):
        change = request.get_json()
        db.execute("UPDATE map SET color = ? WHERE cordx = ? AND cordy = ?", 
                   (change["color"], change["x"], change["y"]))
        db.commit()
        socketio.emit("map-update", json.dumps(change))
        print(socketio)
    return "200"
