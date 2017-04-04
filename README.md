# ReactGoYo

A yeoman generator for reactGo.

Right now this generator only generates a new collection for reactGo. Currently this generator only targets MongoDB.  Based on the options you select during the promption phase is does the following:

1. Creates a new Mongoose Model and updates the Model index.
2. (Optionally) Creates a Controller with 4 optional default methods (GET all, POST create, PUT update and DELETE remove) and updates the Controller index and Server routes.
3. (Optionaly) Creates a data fetcher and updates the data fetch index.
4. (Optionaly) Creates a new redux reducer for the methods selected and updated the root reducer.
5. (Conditionally) Updates the types index to add necessary types for above reducer and data fetcher.
6. (Optionaly) Creates an actions file for use in your Client side routes and Page container. 

Full details on steps taken and code basis here: [http://www.joemotacek.com/reactgo-steps-to-add-a-new-data-set-to-the-store/][http://www.joemotacek.com/reactgo-steps-to-add-a-new-data-set-to-the-store/]

## TODO

- Add input validation to prompts
- Get rid of escodegen as the project is no longer maintained and switch to recast or simliar.
- Reconfigure the collection generator as a sub generator
- Add a page generator


## Known bugs

- Because I'm currently using escodegen comments for certain udpated files cannot be maintained.  