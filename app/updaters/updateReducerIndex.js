var esprima = require('esprima');
var escodegen = require('escodegen');
var _ = require('underscore');

const updateReducerIndex = (yeomanContext) => {
	// Update the model index...
	const currentModelIndex = yeomanContext.destinationPath('app/reducers/index.js');
	yeomanContext.fs.copy(currentModelIndex, currentModelIndex, {
		process: function(content) {
			const sourceTree = esprima.parse(content.toString(), { sourceType: 'module', comment: true });
			const nameLC = yeomanContext.props.collection_name.toLowerCase();
			// console.log(sourceTree.body[0].declaration.body.body);
			sourceTree.body.splice(
				_.findLastIndex(sourceTree.body, {type: 'ImportDeclaration'}),
				0,
				{
				type: 'ImportDeclaration',
				specifiers: [
					{ 
						type: 'ImportDefaultSpecifier',
						local: { type: 'Identifier', name: nameLC }
					}
				],
				source: { 
					type: 'Literal', 
					value: `./${nameLC}`,
					raw: `\'./${nameLC}\'` 
				}
			});

			sourceTree.body[_.findLastIndex(sourceTree.body, {type: 'VariableDeclaration'})]
			.declarations[0].init.arguments[0].properties.push({
				"type": "Property",
				"key": {
					"type": "Identifier",
					"name": nameLC
				},
				"computed": false,
				"value": {
					"type": "Identifier",
					"name": nameLC
				},
				"kind": "init",
					"method": false,
					"shorthand": true
			});

			content = escodegen.generate(sourceTree, {format:{indent:{style:'	'}}});

			return content;
		}
	});
}

module.exports = updateReducerIndex;
