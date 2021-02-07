import { push } from "react-router-redux";
import { put } from "redux-saga/effects";
import axios from "axios";
import history from "./../utils/history"

export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function* errorHandler(error, errorType) {
	if (error.response) {
		if (error.response.status === 401) {
			localStorage.clear();
			history.push('/login')
		} else if (error.response.status === 400) {
			yield put({
				type: errorType,
				error: error.response.data.message ? error.response.data.message : error.response.data.error
			})
		} else if (error.response.status === 403) {
			yield put(push({ pathname: '/error403', state: { error: error.response.data.message ? error.response.data.message : error.response.data.error } }));
		} else if (error.response.status === 404) {
			yield put(push("/error404"));
		} else {
			yield put({ type: errorType, error: error.response.data.message });
		}
	} else {
		yield put({ type: errorType, error: error.message ? error.message : error });
	}
}