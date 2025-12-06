# POST /auth/login
USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFwaUBhYmNyeS5jb20iLCJzdWIiOiJVU0VSLWY5YmZlMjk4LWU2MTMtNGIwMi1hMzVkLTU3Yjk4ZTQwNTM1YSIsImZpcnN0TmFtZSI6IkFCQyIsImxhc3ROYW1lIjoiUlkiLCJyb2xlSWQiOiJPVEhFUiIsInBlcm1pc3Npb25zIjpbXSwiY3JlYXRlZEF0IjoiMjAyMy0wNC0wM1QwODoyOTowOC45MzVaIiwiaWF0IjoxNjgwNTEwNTQ4LCJleHAiOjE2ODExMTUzNDh9.XyqBxcfGGdTSuMmdhIWPw1VyGi6zxrfH_zbEoEv7Jd8"

function signIn() {
  curl -X POST http://localhost:3000/api/auth/sign-in -d '{"email": "ggumburashvili@newage.io", "password": "Gio123@#$"}' -H "Content-Type: application/json"
}

function signUp() {
  curl -X POST http://localhost:3000/api/auth/sign-up \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${USER_TOKEN}" \
    -d '{
      "email": "ggumburashvili2@gmail.com",
      "firstName": "Giorgi",
      "lastName": "Gumburashvili",
      "password": "Test123@#$"
    }'
}

function getProfile() {
  curl -X GET http://localhost:3000/api/auth/me \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${USER_TOKEN}"
}

function getUserById() {
  USER_ID="USER-03c20e34-1942-4e35-a43c-db787ba91db8"
  curl -X GET http://localhost:3000/api/users/user/${USER_ID} \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${USER_TOKEN}"
}


#signIn
#signUp
#getProfile
#getUserById
