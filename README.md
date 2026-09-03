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



# Production

Create application directory on the server:

```
sudo mkdir -p /opt/contact-form
sudo chown $USER:$USER /opt/contact-form

cd /opt/contact-form
```

Put the `docker-compose.prod.yml` and `.env` in the new directory:

```
/opt/contact-form/
├── docker-compose.prod.yml
└── .env
```

`.env` needs to contain production secrets. Consult `.env.example`.

## GitHub Secrets

Create a key on the local machine:

```
ssh-keygen -t ed25519 -C "github-actions-contact-form-deploy"
```

When prompted, name it:

```
~/.ssh/github-actions-contact-form-deploy
```

Copy the public key to the clipboard:

```
xclip -selection clipboard <  ~/.ssh/github-actions-contact-form-deploy.pub
```

Login to the host machine:

```
vim ~/.ssh/authorized_keys
```

Paste the public key as one line.

Test the key from the local machine:

```
ssh -i ~/.ssh/github-actions-contact-form-deploy deploy@YOUR_SERVER_IP
```

Add the private key to GitHub. Go to the repository:

Settings → Secrets and variables → Actions → New repository secret

Create:

```
Name:
SERVER_SSH_KEY
```

Then get your private key:

```
xclip -selection clipboard <  ~/.ssh/github-actions-contact-form-deploy
```

Paste it into the GitHub secret.


Then add:

```
SERVER_HOST = 203.0.113.10
```

And,

```
SERVER_USER = deploy
```

## Create a GitHub token for the server

Go to GitHub:

**Settings → Developer settings → Personal access tokens → Tokens (classic)**

Create a classic token with:

```
read:packages
```

You only need package read access for the server.

Don't use the GitHub Actions SSH key for this—this is a separate credential.


Log Docker into GHCR on Ubuntu. On the server, run:

```
docker login ghcr.io
```

When prompted:

```
Username:
```

enter your GitHub username.

For:

```
Password:
```

paste the GitHub token.

You should get:

```
Login Succeeded
```

Then test:

```
docker pull ghcr.io/bsccorp/contact-form-api:latest
```

and:

```
docker pull ghcr.io/bsccorp/contact-form-web:latest
```

If both work, your authentication is fixed.


