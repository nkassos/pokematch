## Getting Started

The live server is accessible at
https://pokematch-jayl.onrender.com

### Running locally
Install dependencies
```bash
npm install
```

Run the development server:
```bash
npm run dev
```

Alternatively, a production build be created with
```bash
npm run build
npm start
```

Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Discussion

This application covers 2 basic use cases:
1. View a Pokemon by ID
2. View matches of the selected Pokemon

The application opens to a page allowing you to enter the ID of the desired Pokemon.
After navigating to the detail page for that pokemon, it's details along with a list of matches will be presented.
Clicking on a match will take you to the detail page for that match.
You can select `Back to home` at any time to return to the main page, and enter a new pokemon ID.

Error handling is deliberately minimal for this application.
Entering an invalid ID will simply direct you back to the home page.

The application is designed to showcase some basic principles of software engineering:
1. Dependency injection

The react components draw their dependencies from `container.ts`.
This allows the IoC container to wire the components;
for this simple application, it is all accomplished by hand,
however a more complex application would likely use a library like inversify etc.
This particular arrangement is somewhat specific to a fullstack NextJS application,
but satisfies the pattern well enough.

2. Modularization and layered design

The backend consists of a standard model and service layer.
The model is encapsulated by the API Client and a cache for efficient match lookups.
To be a little more standard, I could have added a distinct Repository layer (wrapping the API Client in this case),
but for this simple application I omitted it.  In a real application,
this would generally consist of databases, caches, possibly APIs, etc.

The service layer is encapsulated in the `PokemonService`.
The distinguishing feature of the Service layer is that it contains all business logic,
and uses only internal domain objects for its signatures. The domain model
in this application consists of a single 'Pokemon' interface,
and there is some light mapping between the API model and the Domain model
to create the `profileImage` property.


### Method

The primary challenge for this application was the lack of an efficient
query to search for pokemon by `base_experience`.
Some possible solutions for this include:
1. Querying and searching the entire list on each request;
this would be very inefficient and slow
2. Create a local backup of the pokemon database (or clone the public git repository used for this API)
This is plausible for this specific case, but depends heavily on the details:
How large is the dataset?  How often does it need to be updated/how fresh does the data need to be?
3. The solution employed in this project, create a local cache of base_experience -> pokemon IDs.

For this project I chose solution 4, as it minimized the local storage required, 
while allowing efficient lookups.

For generating the cache, I considered having it run on application startup to reduce
boilerplate and ensure it's up to date every time the application runs,
but ultimately chose to create a npm script to generate it.
This avoids long startup times, and can be regenerated with the latest data any time
by running `npm run init-cache`.