#  Usage:
# (Optional): virtual env `python3 -m venv env` and active `source env/bin/activate`
# 1. install requirements `pip install -r requirements.txt`
# 2. run `./start`
# 3. App should run on http://127.0.0.1:5000
#
# Once you're done, you can run `black .` to automatically format this file

from flask import Flask, url_for
from werkzeug.routing import BuildError
import json
import os

app = Flask(__name__)

with open("../../data/events.json", "r", encoding="ascii") as f:
    events = json.load(f)

with open("../../data/users.json", "r", encoding="ascii") as f:
    users = json.load(f)


@app.route("/api/analyze")
def analyze():
    # TODO: This is just an empty stub. Feel free to change it however you like and add more endpoints as necessary
    return {'results': events}



@app.route("/")
def home():
    links = []
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        if "GET" in rule.methods:
            try:
                url = url_for(rule.endpoint, **(rule.defaults or {}))
                links.append(url)
            except BuildError:
                pass
    return "This is your backend server. These are the routes that are defined:<br />{}".format(
        "<br>".join(["<a href='{url}'>{url}</a>".format(url=link) for link in links])
    )

