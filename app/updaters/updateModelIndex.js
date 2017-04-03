var esprima = require('esprima');
var escodegen = require('escodegen');

const updateModelIndex = (yeomanContext) => {
	// Update the model index...
	const currentModelIndex = yeomanContext.destinationPath('server/db/mongo/models/index.js');
	yeomanContext.fs.copy(currentModelIndex, currentModelIndex, {
		process: function(content) {
			const sourceTree = esprima.parse(content.toString(), { sourceType: 'module' });
			// console.log(sourceTree.body[0].declaration.body.body);
			sourceTree.body[0].declaration.body.body.push({
				type: "ExpressionStatement",
				expression: {
					type: "CallExpression",
					callee: {
						type: "Identifier",
						name: "require"
					},
					arguments: [
						{
							type: "Literal",
							value: `./${yeomanContext.props.collection_name.toLowerCase()}`,
							raw: `'./${yeomanContext.props.collection_name.toLowerCase()}'`
						}
					]
				}
			});
			content = escodegen.generate(sourceTree, {format:{indent:{style:'	'}}});

			return content;
		}
	});
}

module.exports = updateModelIndex;
