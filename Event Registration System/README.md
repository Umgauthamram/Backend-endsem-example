Event Registration System

npm i express dotenv cookie-parser jsonwebtoken bcrypt

testing 

✅ 1. Register a user

POST /api/register
Body: { "userName": "john", "password": "1234" }

✅ 2. Login

POST /api/login
Body: { "userName": "john", "password": "1234" }
You'll get a token cookie

✅ 3. Register for an event (send cookie with request)

POST /api/event
Body: { "eventName": "TechTalk 2025" }
✅ 4. Get your events

GET /api/event
