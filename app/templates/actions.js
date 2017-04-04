/* eslint consistent-return: 0, no-else-return: 0*/
import { polyfill } from 'es6-promise';
import request from 'axios';
import * as types from '../types';

polyfill();

export function make<%= name %>Request(method, id, data, api = '/<%= name.toLowerCase() %>') {
	return request[method](api + (id ? ('/' + id) : ''), data);
}
<% if (methods.indexOf('update') >= 0 || methods.indexOf('remove') >= 0) { %>
export function <%= name.toLowerCase() %>Failure(data) {
	return {
		type: types.<%= name.toUpperCase() %>_FAILURE,
		error: data.error
	};
}
<% } if (methods.indexOf('create') >= 0) { %>
export function create<%= name %>(data) {
	return (dispatch, getState) => {
		// Return on empty data
		// if (data.requiredString.trim().length <= 0) return;

		// Local duplicate check
		// const { <%= name.toLowerCase() %> } = getState();
		// if (<%= name.toLowerCase() %>.<%= name.toLowerCase() %>s.filter(i => i.uniqueVariable === uniqueVariable).length > 0) {
		// 	return dispatch({
		// 		type: types.CREATE_<%= name.toUpperCase() %>_DUPLICATE
		// 	});
		// }

		return make<%= name %>Request('post', '', {data})
			.then(res => {
				if (res.status === 200) {
					return dispatch({
						type: types.CREATE_<%= name.toUpperCase() %>_SUCCESS,
						_id: res.data._id
						<%_ fields.forEach( (field) => { -%>
							<%_ if (field.fieldName && field.fieldName.trim() !== '') { -%>
						<%= field.fieldName %>: res.data.<%= field.fieldName %>,
							<%_ }
						}); -%>
					});
				}
			})
			.catch(() => {
				return dispatch({
					type: types.CREATE_<%= name.toUpperCase() %>_FAILURE,
					error: 'Could not create <%= name.toLowerCase() %>. (Resource unavailable)'
				});
			});
	};
}
<% } if (methods.indexOf('update') >= 0) { %>
export function update<%= name %>(data) {
	return dispatch => {
		const _id = data._id;
		// If it has an ID run an update
		if (_id.trim().length > 0) {
			return make<%= name %>Request('put', _id, data)
				.then(() => dispatch({ type: types.UPDATE_<%= name.toUpperCase() %>, data }))
				.catch(() => dispatch(<%= name.toLowerCase() %>Failure({ error: 'Could not update <%= name.toLowerCase() %>. (Resource unavailable)'})));
		} else {
			// Otherwise create a new one
			return dispatch(create<%= name %>(data));
		}
	};
}
<% } if (methods.indexOf('remove') >= 0) { %>
export function delete<%= name %>(data) {
	return dispatch => {
		return make<%= name %>Request('delete', data._id)
			.then(() => dispatch({type: types.DELETE_<%= name.toUpperCase() %>, id: data._id}))
			.catch(() => dispatch(c<%= name.toLowerCase() %>Failure({ error: 'Could not delete <%= name.toLowerCase() %>. (Resource unavailable)'})));
	};
}
<% } %>
