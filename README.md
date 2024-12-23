
# Mastermind like experiment

 
## Setup

For deployment, you will need[docker](https://docs.docker.com/engine/install/)

Prepare your `.env` file by following the instructions laid out in the `.env.template` file.

* For deployment/production, a `.env` file is enough.
* For development, create a `.env.development` file for the dev servers and a `.env` file to test the deployment locally.


## Deployment / Production


To build the docker images, run 

```
docker compose build
```

in the root directory. This might take a while.

### Running the app

After completing the setup, start the webapp with

```
docker compose up -d
```

and stop it with

```
docker compose down
```

The frontend and backend will be attached to 127.0.0.1:9960 and 127.0.0.1:9961, respectively (or other ports, depending on what you specified in the .env files).
Use Virtualhosts (Apache) or Server Blocks (Nginx) with reverse proxy to expose these to the outside. [This guide](https://gist.github.com/adriansteffan/48c9bda7237a8a7fcc5bb6987c8e1790) explains how to do this for our setup.

### Updating

To update the app, simply stop the running containers, run a `git pull` and build the docker containers once more.

## Development

### Prerequisites

You will need a current version of [node.js](https://nodejs.org/en/download/) installed on your system.

### Frontend

#### Installation

From the `frontend` directory, run

```
npm install
```

#### Running

Run the app in the development mode with

```
npm run dev
```
in the `frontend` directory.

By default, open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.

#### Buidling the frontend locally (to test)


From the `frontend` directory, run

```
npm run build
```

the resulting output can be found in `frontend/dist/`


### Backend

#### Installing

Run 

```
npm install
```

in the `backend` directory to install all needed dependencies.


#### Running the backend


Start the node server with

```
npm run dev
```

in the ```backend``` directory.

By default, the server will be listening on [http://localhost:8000](http://localhost:8000)

#### Buidling the backend locally (to test)

From the `backend` directory, run

```
npm run build
```

the resulting output can be found in `backend/dist/` and can be run with

```
npm run prod
```


## Authors

* **Adrian Steffan** - [adriansteffan](https://github.com/adriansteffan)
