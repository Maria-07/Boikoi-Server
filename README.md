## Cow Hut Backend deployed Auth Server Link:

https://digital-cow-hut-auth.vercel.app/

# Application Routes:

## Main part

### Auth (User)

| API End Point                                                     | METHOD | Description                                                 |
| :---------------------------------------------------------------- | :----- | :---------------------------------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/auth/login         | POST   | User can login by phoneNumber and password                  |
| https://digital-cow-hut-auth.vercel.app/api/v1/auth/signup        | POST   | User can create a account, User can be Buyer or Seller only |
| https://digital-cow-hut-auth.vercel.app/api/v1/auth/refresh-token | POST   | Create a refresh token                                      |

### Auth (Admin)

| API End Point                                                      | METHOD | Description                                  |
| :----------------------------------------------------------------- | :----- | :------------------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/admins/create-admin | POST   | Admin can create an admin account            |
| https://digital-cow-hut-auth.vercel.app/api/v1/admins/login        | POST   | Admin can log in by phoneNumber and password |

### User

| API End Point                                                                 | METHOD | Description                         |
| :---------------------------------------------------------------------------- | :----- | :---------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/users                          | GET    | Admin can Get all Users             |
| https://digital-cow-hut-auth.vercel.app/api/v1/users/64980d217b027785ff6681ce | GET    | Single User Get, only Admin can get |
| https://digital-cow-hut-auth.vercel.app/api/v1/users/6497a501a2fda5f1ec3e12b4 | PATCH  | Only Admin can Update a user        |
| https://digital-cow-hut-auth.vercel.app/api/v1/users/64993d8665e3699afc986ff4 | DELETE | Only Admin can DELETE a user        |

### Cows

| API End Point                                                                | METHOD | Description                                  |
| :--------------------------------------------------------------------------- | :----- | :------------------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/cows                          | POST   | Only Seller can create a cow                 |
| https://digital-cow-hut-auth.vercel.app/api/v1/cows                          | GET    | All User can get cows                        |
| https://digital-cow-hut-auth.vercel.app/api/v1/cows/6499400e65e3699afc987002 | GET    | Single Cow Get, All Users can get            |
| https://digital-cow-hut-auth.vercel.app/api/v1/cows/6499400e65e3699afc987002 | PATCH  | Only The seller of that cow can Update a cow |
| https://digital-cow-hut-auth.vercel.app/api/v1/cows/649940a165e3699afc987005 | DELETE | Only The seller of that cow can DELETE a cow |

### Orders

| API End Point                                         | METHOD | Description                                                       |
| :---------------------------------------------------- | :----- | :---------------------------------------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/orders | POST   | Only buyer can order a cow                                        |
| https://digital-cow-hut-auth.vercel.app/api/v1/orders | GET    | admin, by the specific buyer of this order & seller of this order |

## Bonus Part

### Admin

| API End Point                                                      | METHOD | Description                       |
| :----------------------------------------------------------------- | :----- | :-------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/admins/create-admin | POST   | Admin can create an admin account |

### My Profile

| API End Point                                                   | METHOD | Description     |
| :-------------------------------------------------------------- | :----- | :-------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/users/my-profile | GET    | User Can Access |
| https://digital-cow-hut-auth.vercel.app/api/v1/users/my-profile | PATCH  | User Can Access |

### Orders

| API End Point                                                                  | METHOD | Description                                                       |
| :----------------------------------------------------------------------------- | :----- | :---------------------------------------------------------------- |
| https://digital-cow-hut-auth.vercel.app/api/v1/orders/649944e565e3699afc98703c | GET    | admin, by the specific buyer of this order & seller of this order |
