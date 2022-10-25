#!/usr/bin/python3
# --coding:utf-8--

from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import CORS

import os
import flask
import json

api = flask.Flask(__name__)
CORS(api)

@api.route('/getlog.json', methods=['GET'])
def getLog():
    params = request.args
    if len(params) == 0:
        return jsonify({"log": None})
    page = int(params.get("page"))
    limit = int(params.get("limit"))
    start = (page - 1) * limit + 1
    end = start + limit - 1
    log = os.popen("sed -n '" + str(start) + "," + str(end) + "p' logs.log").read()
    return jsonify({"log": log[:len(log) - 2]})

@api.route('/getlogsize.json', methods=['GET'])
def getLogSize():
    size = os.popen("wc -l < logs.log").read().replace("\n", "")
    return jsonify({"size": int(size)})


if __name__ == '__main__':
    api.run(
        host='127.0.0.1',
        port=1099,
        debug=True
    )
