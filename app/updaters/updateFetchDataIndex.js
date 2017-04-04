var esprima = require('esprima');
var escodegen = require('escodegen');

const updateFetchDataIndex = (yeomanContext) => {
	// Update the model index...
	const file = yeomanContext.destinationPath('app/fetch-data/index.js');
	yeomanContext.fs.copy(file, file, {
		process: function(content) {
			const sourceTree = esprima.parse(content.toString(), { sourceType: 'module', comment: true });
			// console.log(sourceTree.body);
			sourceTree.body.push({
        "type": "ExportNamedDeclaration",
        "declaration": null,
        "specifiers": [
            {
                "type": "ExportSpecifier",
                "exported": {
                    "type": "Identifier",
                    "name": `fetch${yeomanContext.props.collection_name}Data`
                },
                "local": {
                    "type": "Identifier",
                    "name": "default"
                }
            }
        ],
        "source": {
            "type": "Literal",
            "value": `./fetch${yeomanContext.props.collection_name}Data`,
            "raw": `'./fetch${yeomanContext.props.collection_name}Data'`
        }
			});
			content = escodegen.generate(sourceTree, {format:{indent:{style:'	'}}});

			return content;
		}
	});
}

module.exports = updateFetchDataIndex;
