from flask import Flask, jsonify,Response,request
import os
import requests

app = Flask(__name__)


WEBINARJAM_API_KEY = os.environ.get("WEBINARJAM_API_KEY", '')
WEBINARJAM_WEBINAR_ID = os.environ.get("WEBINARJAM_WEBINAR_ID", '')
WEBINARJAM_GET_WEBINAR_SCHEDULE = "https://webinarjam.genndi.com/api/everwebinar/webinar"
WEBINARJAM_REGISTER_WEBINAR = "https://webinarjam.genndi.com/api/everwebinar/register"

@app.route('/schedule/webinars/<webinar_id>/', methods=['GET'])
def get_webinar_schedule(webinar_id):
	webinar_response, webinar_exist = build_webinar_schedule_response(webinar_id)
	if not webinar_exist:
		return Response("Something went wrong", status=500, mimetype='application/json')

	return jsonify(webinar_response)


def build_webinar_schedule_response(webinar_id):
	if webinar_id == "DEFAULT":
		webinar_id =  WEBINARJAM_WEBINAR_ID

	webinar_jam_get_body = {
	    "api_key":WEBINARJAM_API_KEY,
	    "webinar_id":webinar_id,
	    "real_dates":1
	}
	req = requests.post(WEBINARJAM_GET_WEBINAR_SCHEDULE,data=webinar_jam_get_body)
	if not req.status_code == 200:
		return {},False
	resp = req.json()
	try:
		webinars = resp['webinar']
		return webinars['schedules'][:4],True
	except KeyError:
		return {},False

@app.route('/register/webinars/<webinar_id>/<schedule>/', methods=['POST'])
def register_webinar(webinar_id,schedule):
	webinar_response, webinar_exist = build_webinar_register_response(webinar_id,schedule,request.get_json())
	if not webinar_exist:
		return Response("Something went wrong", status=500, mimetype='application/json')

	return jsonify(webinar_response)

def build_webinar_register_response(webinar_id,schedule,user_data):
	if webinar_id == "DEFAULT":
		webinar_id =  WEBINARJAM_WEBINAR_ID

	webinar_jam_register_body = {
	    "api_key":WEBINARJAM_API_KEY,
	    "webinar_id":webinar_id,
	    "schedule":schedule,
		"first_name":user_data.get("first_name",''),
		"email":user_data.get("email",''),
		"phone":user_data.get("phone",'')
	}
	if schedule == "jot":
		webinar_jam_register_body['real_dates'] = 1

	req = requests.post(WEBINARJAM_REGISTER_WEBINAR,data=webinar_jam_register_body)
	if not req.status_code == 200:
		return {},False
	resp = req.json()
	try:
		user = resp['user']
		return { "redirect_uri":user['thank_you_url']},True
	except KeyError:
		return {},False


if __name__ == '__main__':
	app.run(debug=True,host = '0.0.0.0')
