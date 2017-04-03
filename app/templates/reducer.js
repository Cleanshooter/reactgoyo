import { combineReducers } from 'redux';
import * as types from '../types';

const <%= name.toLowerCase() %> = (
	state = {},
	action
) => {
	switch (action.type) {
		<%_ if (methods.indexOf('create') >= 0) { -%>
		case types.CREATE_<%= name.toUpperCase() %>_SUCCESS:
			return {
				_id: action._id,
				<%_ fields.forEach( (field) => { -%>
			  	<%_ if (field.fieldName && field.fieldName.trim() !== '') { -%>
				<%= field.fieldName %>: action.<%= field.fieldName %>,
			  	<%_ }
			  }); -%>
			};
		<%_ } if (methods.indexOf('update') >= 0) { -%>
		case types.UPDATE_<%= name.toUpperCase() %>:
			if (state._id === action._id) {
				return {
					...state,
					<%_ fields.forEach( (field) => { -%>
				  	<%_ if (field.fieldName && field.fieldName.trim() !== '') { -%>
					<%= field.fieldName %>: action.<%= field.fieldName %>,
						<%_ }
					}); -%>
				};
			}
			return state;
		<%_ } -%>
		default:
			return state;
	}
};

const <%= name.toLowerCase() + 's' %> = (
	state = [],
	action
) => {
	switch (action.type) {
		<%_ if (methods.indexOf('all') >= 0) { -%>
		case types.FETCH_<%= name.toUpperCase() + 'S' %>_SUCCESS:
			if (action.data) return action.data;
			return state;
		<%_ } if (methods.indexOf('create') >= 0) { -%>
		case types.CREATE_<%= name.toUpperCase() %>_SUCCESS:
			return [...state, <%= name.toLowerCase() %>(undefined, action)];
		case types.CREATE_<%= name.toUpperCase() %>_FAILURE:
			return state.filter(i => i._id !== action._id);
		<%_ } if (methods.indexOf('update') >= 0) { -%>
		case types.UPDATE_<%= name.toUpperCase() %>:
			return state.map(i => <%= name.toLowerCase() %>(i, action));
		<%_ } if (methods.indexOf('remove') >= 0) { -%>
		case types.DELETE_<%= name.toUpperCase() %>:
			return state.filter(i => i._id !== action._id);
		<%_ } -%>
		case types.<%= name.toUpperCase() %>_FAILURE:
			console.log(action.error);
			return state;
		default:
			return state;
	}
};

const <%= name.toLowerCase() %>Reducer = combineReducers({
	<%= name.toLowerCase() + 's' %>
});

export default <%= name.toLowerCase() %>Reducer;
