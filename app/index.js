var Generator = require('yeoman-generator');

// Local Imports
var updateModelIndex = require('./updaters/updateModelIndex');
var updateControllerIndex = require('./updaters/updateControllerIndex');
var updateServerRoutes = require('./updaters/updateServerRoutes');

const modelFieldsArray = [];

module.exports = Generator.extend({
	// Private recursive modole field generator
	_modelField(resolve) {
    const prompts = [
			{
				type: 'input',
				name: 'fieldName',
				message: 'Please enter a field name for your new schema.'
			},
			{
				type: 'list',
				name: 'fieldType',
				message: 'What is the field\'s Type.',
				choices:['String', 'Number', 'Date', 'Buffer', 'Boolean', 'Mixed', 'ObjectId', 'Array']
			}
		];
		return this.prompt(prompts).then((answers) => {
			if (answers.fieldName !== '') {
				modelFieldsArray.push(answers);
				this._modelField(resolve);
			} else {
				resolve(modelFieldsArray);
			}
		});
  },

	prompting: {
		welcome() {
			this.log('Welcome to the ReactGo collection generator!')
	  	this.log('To get an idea of all the things it does please check out my blog post.')
	  	this.log('http://www.joemotacek.com/reactgo-steps-to-add-a-new-data-set-to-the-store/');
		},
		datasetName() {
			const prompts = [
				{
		      type    : 'input',
		      name    : 'collection_name',
		      message : 'What is your new collection name?'
		    }
			];
			return this.prompt(prompts).then((answers) => {
				this.props = Object.assign({}, this.props, answers);
	      // this.log('collection name', answers.collection_name);
	    });
		},
		modelFields() {
			return new Promise((resolve) => this._modelField(resolve)).then((answers) => {
				this.props = Object.assign({}, this.props, {model_fields: answers});
				// this.log('model fields', answers);
			});
		},
		contolerOptions() {
			const prompts = [
				{
		      type: 'checkbox',
				  name: 'controller_methods',
				  message: 'Which default controller methods would you like to include?',
				  choices: [
					  {
					    name: '(GET) All',
					    value: 'all',
					    checked: true
					  }, {
					    name: '(POST) Create',
					    value: 'create',
					    checked: true
					  }, {
					    name: '(PUT) Update',
					    value: 'update',
					    checked: true
					  },
					  {
					    name: '(DELETE) Remove',
					    value: 'remove',
					    checked: true
					  }
				  ]
		    },
		    {
					name: 'data_fetcher',
					message: 'Generate a data fetcher for your (GET) All?',
					type: 'confirm',
					default: true,
					when: function(answers){
					  return answers.controller_methods.indexOf('all') >= 0;
					}
				},
				{
		      type: 'confirm',
				  name: 'default_reducer',
				  message: 'Generate a redux reducer for your selected controller methods?',
				  default: true,
				  when: function(answers){
				  	return answers.controller_methods.length > 0;
				  }
		    },
				{
		      type: 'confirm',
				  name: 'default_actions',
				  message: 'Generate actions?',
				  default: true,
				  when: function(answers){
				  	return answers.controller_methods.length > 0;
				  }
		    }
			];
			return this.prompt(prompts).then((answers) => {
				this.props = Object.assign({}, this.props, answers);
	      //this.log('Complete Props', JSON.stringify(this.props, '', 2));
	    });
		}
  },

  writing() {
  	// Create the model
  	this.fs.copyTpl(
  		this.templatePath('model.js'),
  		this.destinationPath(`server/db/mongo/models/${this.props.collection_name.toLowerCase()}.js`),
      {
      	name: this.props.collection_name,
      	fields: this.props.model_fields
			}
  	);
  	updateModelIndex(this);

  	// Create the controller
  	if(this.props.controller_methods.length > 0){
  		this.fs.copyTpl(
	  		this.templatePath('controller.js'),
	  		this.destinationPath(`server/db/mongo/controllers/${this.props.collection_name.toLowerCase()}.js`),
	      {
	      	name: this.props.collection_name,
	      	methods: this.props.controller_methods
				}
	  	);
	  	// Update teh Controller Index
	  	updateControllerIndex(this);
	  	//Create the routes
	  	updateServerRoutes(this);

	  	//Conditionally create data fetcher
			if(this.props.data_fetcher){
				this.fs.copyTpl(
					this.templatePath('fetchData.js'),
					this.destinationPath(`app/fetch-data/fetch${this.props.collection_name}Data.js`),
					{
						name: this.props.collection_name
					}
				);
	  	}

	  	//Conditionally create default reducer
			if(this.props.default_reducer){
				this.fs.copyTpl(
					this.templatePath('reducer.js'),
					this.destinationPath(`app/reducers/${this.props.collection_name.toLowerCase()}.js`),
					{
						name: this.props.collection_name,
						methods: this.props.controller_methods,
						fields: this.props.model_fields
					}
				);
	  	}
  	}
  }
});