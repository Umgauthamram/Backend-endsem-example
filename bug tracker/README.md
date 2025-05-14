npm i express dotenv cookie-parser jsonwebtoken bcrypt



1. Register User
POST /api/register


{
  "userName": "jaya",
  "password": "bug123"
}
2. Login User
POST /api/login


{
  "userName": "jaya",
  "password": "bug123"
}
📝 Store the returned token cookie

3. Submit a Bug
POST /api/bugs


{
  "title": "Login page crashes",
  "description": "App crashes when clicking login without entering credentials"
}
🔐 Requires token cookie (after login)

4. Get All Bugs (submitted by you)
GET /api/bugs

Response:

{
  "bugs": [
    {
      "userName": "jaya",
      "title": "Login page crashes",
      "description": "App crashes when clicking login without entering credentials"
    }
  ]
}