var esprima = require('esprima');
var escodegen = require('escodegen');
var _ = require('underscore');

const updateControllerIndex = (yeomanContext) => {
	// Update the controller index...
	const currentControllerIndex = yeomanContext.destinationPath('server/db/mongo/controllers/index.js');
	yeomanContext.fs.copy(currentControllerIndex, currentControllerIndex, {
		process: function(content) {
			const sourceTree = esprima.parse(content.toString(), { sourceType: 'module' });
			// console.log(sourceTree.body[_.findIndex(sourceTree.body, {type: 'ImportDeclaration'})]);
			// Find the last import and add a new one.
			sourceTree.body.splice(
				_.findLastIndex(sourceTree.body, {type: 'ImportDeclaration'})+1,
				0,
				{
				type: 'ImportDeclaration',
				specifiers: [
					{ 
						type: 'ImportDefaultSpecifier',
						local: { type: 'Identifier', name: yeomanContext.props.collection_name.toLowerCase() }
					}
				],
				source: { 
					type: 'Literal', 
					value: `./${yeomanContext.props.collection_name.toLowerCase()}`,
					raw: `\'./${yeomanContext.props.collection_name.toLowerCase()}\'` 
				}
			});
			// Add the named export
			sourceTree.body[_.findIndex(sourceTree.body, {type: 'ExportNamedDeclaration'})]
			.specifiers.push({
				type: 'ExportSpecifier',
				exported: { type: 'Identifier', name: yeomanContext.props.collection_name.toLowerCase() },
				local: { type: 'Identifier', name: yeomanContext.props.collection_name.toLowerCase() }
			});
			// Add the named default export
			sourceTree.body[_.findIndex(sourceTree.body, {type: 'ExportDefaultDeclaration'})]
			.declaration.properties.push({
				type: 'Property',
				key: { type: 'Identifier', name: yeomanContext.props.collection_name.toLowerCase() },
				computed: false,
				value: { type: 'Identifier', name: yeomanContext.props.collection_name.toLowerCase() },
				kind: 'init',
				method: false,
				shorthand: true 
			});
			//console.log(JSON.stringify(sourceTree, '', 2));
			content = escodegen.generate(sourceTree, {format:{indent:{style:'	'}}});

			return content;
		}
	});
}

module.exports = updateControllerIndex;
