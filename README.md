## Running the project

```bash
cp .env.template .env
```

Then install the dependencies

```bash
yarn install
```

Start the application

```bash
yarn run dev
```

You can visit the app by going to `http://localhost:3000`.

You can create a user by sending a POST request to `http://localhost:3000/users`.

```json
{
  "username": "test-user",
  "email": "test@gmail.com",
  "password": "test1234"
}
```
