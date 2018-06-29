# TrackingSystem

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


To start mongoDB:
- create directory: D:\mongoDB\data;
open cmd (admin):
- C:\Program Files\MongoDB\Server\3.4\bin> mongod --dbpath=D:\mongoDB\data;
- C:\Program Files\MongoDB\Server\3.4\bin> mongo;
To start app:
- directory-to-app> node server.js
To build app:
- directory-to-app> npm run build-sw

working with mongoDB:
use tracking_system
db.createCollection("projects");
db.createCollection("employees");
db.createCollection("reports");
db.employees.insert([{'employeeId': '1', 'employeeName': 'Yury'}, {'employeeId': '2', 'employeeName': 'Yuliya'}])
db.projects.insert([{'projectId': '1', 'name': 'NewProject1'}, {'projectId': '2', 'name': 'NewProject2'}])

Public Key:
BDCqREY9G8__-ZRTC5zWAO5ox73t9yUm_l0rR-kXKm0ZBHtB5vjjHhP90dxjTUuzbMUOoocE2tBPDDdbkOJwnO0

Private Key:
h7hheK7ufvrG_MOaF6z-vIa56jcOxOa6xlhRAWniVoc
