# Repair Order Tracker App

This is the database API where the connection to the front-end will be handled. Incuding the typical REST & CRUD methods, authentication, and session management.

----

This is going to be where I try to describe what the hell im doing.

## The idea:

A coworker was "promoted" to team leader and is having a hard time keeping track of the hundreds of repair orders (ROs) that go through the shop in a week. This makes things like keeping the teams labor balanced and time management a pain in the ass.

I want this app to be able to store 2 - 3 months worth of ROs and any that are active, allow him, and anyone, to be able to easily see what there is, where it is and how the team is doing.

Now, one would think this is something easy and should be built into what ever app is used by the dealership to manage all of this in the first place. Well one would be `wrong`. If it exists, we plebian technicians dont get access to it. Besides, after using these apps, i doubt if the managers get access to anything that usefull.

## How this is going to work:

The basics of a database access and management system is the essentials and after that basic foundation is layed, things like charting and predictive suggestions are future plans.

> First things first, the `Database`. Its a MongoDB running on [Atlas](https://www.mongodb.com/cloud/atlas) so the database host is not an issue. traffic wont be that big and if things get too busy or slow it down too much, i can upgrade the clusters to a paid tier.

> The database `API`. The plan is `Node.js` with `Express` and `Mongoose`, compiled by `TypeScript`. Hopefully i can get it running in a docker container and hosted on Googles `App Engine`. If not, I can host it on `Heroku`.

> The `Front-End`: This is not too bad. `React` framework with `TypeScript`. Nothing special. Except authentication is handled with `Auth0`. [Next.js](https://nextjs.org/docs/getting-started) was concidered but its not as usefull for me. Things like documentation arent a big deal. Info is pretty easy to come by. Probably going to use [Netlify](https://www.netlify.com/products/workflow/) for hosting. Theres not much more to say. Im **not** going to use [Material-UI](https://material-ui.com/) or something similar. I **am** going to try to conform to the principles of Material Design. This is a good oportunity to learn how to create modern UIs with CSS and my own two hands. This mostly has to function. Fancy can come later.

## The Current Feature List:

- Store modify and recall data from the database
- Assign techs to a repair order, connect jobs to that repair order, and store the repair orders in a pay period.
- A user will be able to log in and have all their preferences.
- Track total labor hours from the completed jobs and display it in an intuitive and clear way.
- Keep a rolling history of work completed by a team.
- Chart the data recieved in the app.

## The Current Technology List:

* React
* Express
* Auth0
* Typescript
* Mongoose
* MongoDB
* Atlas
* Docker
* Swagger

##### Theres no timeline. I don't know when this will be done.

----

# Running this thing

## Running the dev environment:


- Pull the repository from github
- create and set the `.env` file.
- Run `npm install`
- Run `npm run dev`
- Go to the local host specified by the `.env` file.
- Testing the API endpoints can be done with the `REST Client` VSCode extension. (Im going to setup Swagger soon.)

## Deplyment:

### **Creating the Docker container:**

(WIP)

### **Production Build

- Set the `.env` mode to `prod`
- run `npm build`

When I know how to deploy this bad boy, this is where the walkthrough will be.