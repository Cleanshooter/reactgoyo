<% if (methods.indexOf('update') >= 0) { -%>
import _ from 'lodash';
<% } -%>
import <%= name %> from '../models/<%= name %>';
<% if (methods.indexOf('all') >= 0) { %>
/**
 * List
*/
export function all(req, res) {
	<%= name %>.find({}).exec((err, <%= name.toLowerCase() + 's' %>) => {
		if (err) {
			console.log('Error in first query');
			return res.status(500).send('Something went wrong getting the data');
		}

		return res.json(<%= name.toLowerCase() + 's' %>);
	});
}
<% } if (methods.indexOf('create') >= 0) { %>
/**
 * Create
 */
export function create(req, res) {
	<%= name %>.create(req.body, (err, newItem) => {
		if (err) {
			console.log(err);
			return res.status(400).send('Couldn\'t create <%= name.toLowerCase() %>');
		}

		return res.status(200).send(newItem);
	});
}
<% } if (methods.indexOf('update') >= 0) { %>
/**
 * Update
 */
export function update(req, res) {
	const query = { _id: req.params.id };
	const omitKeys = ['id', '_id', '_v'];
	const data = _.omit(req.body, omitKeys);

	<%= name %>.findOneAndUpdate(query, data, (err) => {
		if (err) {
			console.log(err);
			return res.status(500).send('We failed to save the <%= name.toLowerCase() %> update for some reason');
		}

		return res.status(200).send('Updated the <%= name.toLowerCase() %> uccessfully');
	});
}
<% } if (methods.indexOf('remove') >= 0) { %>
/**
 * Delete
 */
export function remove(req, res) {
	const query = { _id: req.params.id };
	<%= name %>.findOneAndRemove(query, (err) => {
		if (err) {
			console.log(err);
			return res.status(500).send('We failed to delete the <%= name %> for some reason');
		}

		return res.status(200).send('Deleted <%= name.toLowerCase() %> successfully');
	});
}
<% } %>
// Export the default modules
export default {
	<%_ if (methods.indexOf('all') >= 0) { -%>
	all,
	<%_ } if (methods.indexOf('create') >= 0) { -%>
	create,
	<%_ } if (methods.indexOf('update') >= 0) { -%>
	update,
	<%_ } if (methods.indexOf('remove') >= 0) { -%>
	remove
	<%_ } -%>
};
