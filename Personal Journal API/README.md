npm i express dotenv cookie-parser jsonwebtoken bcrypt uuid

Testing Examples (Thunder Client or Postman)
1. Register
POST /api/register

json
Copy
Edit
{
  "userName": "jaya",
  "password": "pass123"
}
2. Login
POST /api/login

json
Copy
Edit
{
  "userName": "jaya",
  "password": "pass123"
}
🔐 This sets the JWT token in cookies.

3. Create Journal Entry
POST /api/journal

json
Copy
Edit
{
  "title": "Day 1",
  "content": "Started journaling today!"
}
4. Get All My Journals
GET /api/journal

Response:

json
Copy
Edit
{
  "journals": [
    {
      "id": "uuid-id",
      "userName": "jaya",
      "title": "Day 1",
      "content": "Started journaling today!"
    }
  ]
}
5. Update Journal Entry
PUT /api/journal/:id

Replace :id with the journal's actual UUID.

json
Copy
Edit
{
  "title": "Day 1 - Updated",
  "content": "Feeling good about this journaling habit!"
}
