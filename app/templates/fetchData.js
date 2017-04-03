import axios from 'axios';
import * as types from '../types';

const fetchData = () => {
	return {
		type: types.FETCH_DATA_REQUEST,
		promise: axios.get('/<%= name.toLowerCase() %>s')
			.then(res => { return {type: types.FETCH_<%= name.toUpperCase() %>_SUCCESS, data: res.data}; })
			.catch(error => { return {type: types.FETCH_DATA_FAILURE, data: error}; })
	};
};

export default fetchData;
