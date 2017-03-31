var Generator = require('yeoman-generator');

const modelFieldsArray = [];

module.exports = Generator.extend({
	// Prinvate recursive modole field generator
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
			this.log('Welcome to the ReactGo dataset generator!')
	  	this.log('To get an idea of all the things it does please check out my blog post.')
	  	this.log('http://www.joemotacek.com/reactgo-steps-to-add-a-new-data-set-to-the-store/');
		},
		datasetName() {
			const prompts = [
				{
		      type    : 'input',
		      name    : 'dataset_name',
		      message : 'What is your new dataset\'s name?'
		    }
			];
			return this.prompt(prompts).then((answers) => {
	      this.log('dataset name', answers.dataset_name);
	    });
		},
		modelFields() {
			return new Promise((resolve) => this._modelField(resolve)).then((answers) => {
				this.log('model fields', answers);
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
					    value: 'udpate',
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
				  name: 'build_default_reducer',
				  message: 'Generate a redux reducer for your selected controller methods?',
				  default: true,
				  when: function(answers){
				  	return answers.controller_methods.length > 0;
				  }
		    },
				{
		      type: 'confirm',
				  name: 'build_default_actions',
				  message: 'Generate actions?',
				  default: true,
				  when: function(answers){
				  	return answers.controller_methods.length > 0;
				  }
		    }
			];
			return this.prompt(prompts).then((answers) => {
	      this.log('controler methods', answers.controller_methods);
	      this.log('data fetcher?', answers.data_fetcher);
	      this.log('build reducer?', answers.build_default_reducer);
	      this.log('build actions?', answers.build_default_actions);
	    });
		}
  },

  configuring: () => {
    console.log('Config: ', this.modelFieldsArray);
  },

});