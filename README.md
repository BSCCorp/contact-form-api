contact-form-api
================

This a generic contact form API and frontend Vite application. It was produced by prompting ChatGPT, which recommended the project structure and architecture. I don't really care for the MVC arrangement. It seems over engineered.


# API

## Setup

Clone and install:

```
cp .env.example .env
npm install
```

For testing and development, start a MongoDB container:

```
docker run --name dev-mongo -p 27017:27017 -d mongo
```

## Test

```
npm test
```

# Frontend

## Setup

```
cd contact-form-api
cp .env.example .env
npm install
```

## Test

```
npm test
```

Or better yet,

```
npm run test:run
```




