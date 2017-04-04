var esprima = require('esprima');
var escodegen = require('escodegen');
var _ = require('underscore');

const updateTypesIndex = (yeomanContext) => {
	// Update the controller index...
	const file = yeomanContext.destinationPath('app/types/index.js');
	const name = yeomanContext.props.collection_name;
	const nameUC = name.toUpperCase();
	const controllerMethods = yeomanContext.props.controller_methods;

	yeomanContext.fs.copy(file, file, {
		process: function(content) {
			const sourceTree = esprima.parse(content.toString(), { sourceType: 'module', comment: true, range: true });

			// Add our types for selected methods.
			sourceTree.body.push(...(() => {
				let types = `// ${name} actions`;

				if (controllerMethods.indexOf('all') >= 0 && yeomanContext.props.data_fetcher) {
					types += `
						export const FETCH_${nameUC}S_SUCCESS = 'FETCH_${nameUC}S_SUCCESS';`;
				}

				if (controllerMethods.indexOf('create') >= 0) {
					types += `
						export const CREATE_${nameUC}_SUCCESS = 'CREATE_${nameUC}_SUCCESS';
						export const CREATE_${nameUC}_FAILURE = 'CREATE_${nameUC}_FAILURE';
						export const CREATE_${nameUC}_DUPLICATE = 'CREATE_${nameUC}_DUPLICATE';`;
				}

				if (controllerMethods.indexOf('update') >= 0) {
					types += `
						export const UPDATE_${nameUC} = 'UPDATE_${nameUC}';`;
				}

				if (controllerMethods.indexOf('remove') >= 0) {
					types += `
						export const DELETE_${nameUC} = 'DELETE_${nameUC}';`;
				}

				if (controllerMethods.indexOf('remove') >= 0 || 
					controllerMethods.indexOf('update') >= 0) {
					types += `
						export const ${nameUC}_FAILURE = '${nameUC}_FAILURE';`;
				}

				return esprima.parse(types, {sourceType: 'module', comment: true, range: true}).body;
			})());

			content = escodegen.generate(sourceTree, {format:{indent:{style:'	'}}, comment: true} );

			return content;
		}
	});
}

module.exports = updateTypesIndex;
