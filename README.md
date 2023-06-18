# Digital Cow Hut Backend Assignment

Cow Hut Backend deployed Server Link : https://cow-hut-backend-assignment.vercel.app/

## Application Routes:

### Users

- /api/v1/auth/sign-up [POST]
- /api/v1/users/ [GET]
- api/v1/users/648e8fbe447eaf18315e0938 [Single GET]
- api/v1/users/648e8fbe447eaf18315e0938 [PATCH]
- api/v1/users/648da4aa5816aad3806c0276 [DELETE]

### Cows

- api/v1/cows [POST]
- api/v1/cows [GET]
- api/v1/cows/648eab5ab5df68c50240f7f7 [Single GET]
- api/v1/cows/648eab5ab5df68c50240f7f7 [PATCH]
- api/v1/cows/648e8df1655be9e3e66a323e [DELETE]

### Pagination and Filtering routes of Cows

- api/v1/cows?page=1&limit=10
- api/v1/cows?sortBy=price&sortOrder=asc
- api/v1/cows?minPrice=20000&maxPrice=70000
- api/v1/cows?location=Chattogram
- api/v1/cows?searchTerm=Cha
