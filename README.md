A web application for managing Minecraft location coordinates saved through the Lapis Discord bot. This site provides a user-friendly interface to view, add, edit, and delete saved locations, complementing the Discord bot's command-based interface. I.e, you don't need to use Discord if you don't want to. 

Check out [Lapis Proper](https://github.com/Greg-Vincent0711/Lapis)(the backend with the bulk of the complexity...for now)

## Phase

This site is currently in Phase 2 of development.

## Purpose

Lapis.bot was created to solve a common problem for Minecraft players: keeping track of important locations in their worlds. Instead of scrolling through screenshots or manually writing down coordinates(which is what I was doing), players can use Lapis to save and access them at any time.

The website serves as a dashboard where authenticated users can:
- View all their saved Minecraft locations
- Add new locations with coordinates (X, Y, Z)
- Edit existing location details
- Upload images associated with locations
- Connect their Discord account to sync locations saved through the bot

^ This is Phase 1. CRUD operations more or less.

## Tech Stack for Lapis' Site
- **React 19 w/ Typescript **
- **Vite** - Fast build tool and dev server
- **AWS Amplify and Cognito** - Site hosting and Auth
- **Reagraph** - Interactive graph visualization for system architecture showcased on front page
- **Discord OAuth** - Connect Discord accounts to sync bot-saved locations
