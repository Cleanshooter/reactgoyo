var esprima = require('esprima');
var escodegen = require('escodegen');
var _ = require('underscore');

const updateServerRoutes = (yeomanContext) => {
	// Update the controller index...
	const file = yeomanContext.destinationPath('server/init/routes.js');
	const nameLC = yeomanContext.props.collection_name.toLowerCase();
	const controllerMethods = yeomanContext.props.controller_methods;

	yeomanContext.fs.copy(file, file, {
		process: function(content) {
			const sourceTree = esprima.parse(content.toString(), { sourceType: 'module', comment: true });
			// const exportedModule = sourceTree.body[_.findIndex(sourceTree.body, {type: 'ExportDefaultDeclaration'})].declaration.body.body;
			// console.log(exportedModule[exportedModule.length-1].consequent.body[1].expression.arguments[1]);
			// Find the last const declaration and add a new one.
			sourceTree.body.splice(
				_.findLastIndex(sourceTree.body, {type: 'VariableDeclaration'})+1,
				0,
				esprima.parse(`const ${nameLC}Controller = controllers && controllers.${nameLC};`).body[0]
			);

			// Add our conditional routes.
			sourceTree.body[_.findIndex(sourceTree.body, {type: 'ExportDefaultDeclaration'})].declaration.body.body.push( (() => {
				let routes = `if (${nameLC}Controller) {`;

				if (controllerMethods.indexOf('all') >= 0) {
					routes += `app.get('/${nameLC}s', ${nameLC}Controller.all);`;
				}

				if (controllerMethods.indexOf('create') >= 0) {
					routes += `app.post('/${nameLC}', ${nameLC}Controller.create);`;
				}

				if (controllerMethods.indexOf('update') >= 0) {
					routes += `app.put('/${nameLC}/:id', ${nameLC}Controller.update);`;
				}

				if (controllerMethods.indexOf('remove') >= 0) {
					routes += `app.delete('/${nameLC}/:id', ${nameLC}Controller.remove);`;
				}

				routes += `} else {
					console.warn(unsupportedMessage('${yeomanContext.props.collection_name} routes not available'));
				}`;
				// console.log(esprima.parse(routes).body[0]);
				return esprima.parse(routes).body[0];
			})());

			content = escodegen.generate(sourceTree, {format:{indent:{style:'	'}}} );

			return content;
		}
	});
}

module.exports = updateServerRoutes;
