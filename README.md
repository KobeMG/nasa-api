![logo2](https://i.imgur.com/wDcNK4H.jpg)
# NASA Daily Image API Project

A Node JS project that uses the official NASA API to get the daily image and details published by NASA and 
posts them to Instagram using an unofficial API, automating the process. The project keeps track of the posts using Firebase.

## Requirements
- NodeJS
- NASA API Key
- Instagram Account
- Firebase account and credentials

## Installation

1. Clone this project:
```
git clone https://github.com/KobeMG/nasa-api.git
```
2. Install dependences:
```
npm i
```

3. Create the .env file, add the following variables:

```
#NASA:
NASA_API_KEY="your api key"

# Firebase:
PROJECT_ID ="your project ID"
PRIVATE_KEY_ID="your private key id"
PRIVATE_KEY="your private key"
CLIENT_EMAIL="your client email"
CLIENT_ID="your client id"
AUTH_URI="your auth uri"
TOKEN_URI="your token uri"
AUTH_PROVIDER_X509_CERT_URL="your auth provider"
CLIENT_X509_CERT_URL="your client cert url"

#Instagram Account:
INSTAGRAM_USERNAME="your user name"
INSTAGRAM_PASSWORD="your password"

```
