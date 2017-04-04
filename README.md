# ReactGoYo

### A yeoman generator for reactGo.

Right now this generator only generates a new collection for reactGo. Currently this generator only targets MongoDB.  Based on the options you select during the prompting phase is does the following:

1. Creates a new Mongoose Model and updates the Model index.
2. (Optionally) Creates a Controller with four optional default methods 
	(GET all, POST create, PUT update and DELETE remove)
	And updates the Controller index and Server routes.
3. (Optionaly) Creates a Data Fetcher and updates the Fetch Data index.
4. (Optionaly) Creates a new Redux Reducer for the methods selected and updates the Root Reducer.
5. (Conditionally) Updates the Types index to add necessary types for above Reducer and Data Fetcher.
6. (Optionaly) Creates an Actions file for use in your Client side routes and Page container. 

Full details on steps taken and code basis here: [http://www.joemotacek.com/reactgo-steps-to-add-a-new-data-set-to-the-store/][http://www.joemotacek.com/reactgo-steps-to-add-a-new-data-set-to-the-store/]

### Notes:
- Does not use the optimistic update approach used in reactGo in controller create methods in favor of passing the stored model back from Mongoose.  
- Does not generate id as in reactGo create controller since mongoose automatically generates id those are used instead.  So please use _id instead of id. 

## TODO

- Add input validation to prompts
- Get rid of escodegen as the project is no longer maintained and switch to recast or simliar.
- Add support for required fields 
- Add support for unique fields
- Reconfigure the collection generator as a sub generator
- Add a page generator

## Known bugs

- Because I'm currently using escodegen comments for certain udpated files cannot be maintained.  