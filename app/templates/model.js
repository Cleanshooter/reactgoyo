import mongoose from 'mongoose';

const <%= name %>Schema = new mongoose.Schema({
  <%_ fields.forEach( (field) => { -%>
  	<%_ if (field.fieldName && field.fieldName.trim() !== '') { -%>
	<%= field.fieldName %>: <%= field.fieldType %>,
  	<%_ }
  }); -%>
});

export default mongoose.model('<%= name %>', <%= name %>Schema);