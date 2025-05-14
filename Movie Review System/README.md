npm i express dotenv cookie-parser jsonwebtoken bcrypt


POST /api/register
Body: { "userName": "john", "password": "password123" }


POST /api/login
Body: { "userName": "john", "password": "password123" }


POST /api/reviews (requires a valid JWT token in cookies)
Body: { "movieTitle": "Inception", "rating": 5, "reviewText": "Great movie!" }


GET /api/reviews (requires a valid JWT token in cookies)
No body required, returns the list of reviews.