npm i express dotenv cookie-parser jsonwebtoken bcrypt

 1. Register a User
Endpoint:
http
Copy
Edit
POST /api/register
Body (JSON):

{
  "userName": "sara",
  "password": "pass123"
}
✅ Expected Response:

{
  "message": "User registered successfully"
}
✅ 2. Login the User
Endpoint:
http
Copy
Edit
POST /api/login
Body (JSON):

{
  "userName": "sara",
  "password": "pass123"
}
✅ Expected Response:

{
  "message": "Welcome sara"
}
✅ Make sure to store the token cookie that is returned — it’s required for the next two authenticated requests.

✅ 3. Submit Feedback (Authenticated Route)
Endpoint:
http
Copy
Edit
POST /api/feedBack

Body (JSON):


{
  "serviceName": "Kerelance AI",
  "feedBack": "The financial insights are very accurate and helpful!"
}

✅ Expected Response:

{
  "message": "Feedback submitted successfully"
}
✅ Make sure the request sends the token cookie from the login step.

✅ 4. Get Feedback (Authenticated Route)
Endpoint:
http
Copy
Edit
GET /api/getFeed

✅ Expected Response:

{
  "feedbacks": [
    {
      "serviceName": "Kerelance AI",
      "feedBack": "The financial insights are very accurate and helpful!"
    }
  ]
}