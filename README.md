# Cosmic Flies

A small project for managing "cosmic flies" items — API and simple frontend utilities.

## API Reference

Authentication
- Do not commit secrets. Use environment variables for tokens (e.g. GITHUB_TOKEN) and never paste personal access tokens into the README.
- Example header when calling the API:
  Authorization: Bearer <YOUR_TOKEN>

Get all items
```http
GET /api/items
Accept: application/json
Authorization: Bearer <token>
```

Response: 200 OK
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string"
  }
]
```

Notes
- There are no required query parameters for this endpoint by default.
- If your API requires authentication, provide a bearer token via the Authorization header (set via an environment variable in CI or your local shell).

#### Get item

```http
GET /api/items/{id}
Accept: application/json
Authorization: Bearer <token>
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Item identifier (replace {id} with the item's ID) |

## Authors

- [@octokatherine](https://github.com/shloook)


## Acknowledgements

 - [Awesome Readme Templates](https://awesomeopensource.com/project/elangosundar/awesome-README-templates)
 - [Awesome README](https://github.com/matiassingers/awesome-readme)
 - [How to write a Good readme](https://bulldogjob.com/news/449-how-to-write-a-good-readme-for-your-github-project)


## Appendix

Any additional information goes here


## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

## Color Reference

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Example Color | ![#729de0](https://via.placeholder.com/10/0a192f?text=+) #729de0 |
| Example Color | ![#433a7a](https://via.placeholder.com/10/f8f8f8?text=+) #433a7a |
| Example Color | ![#020108](https://via.placeholder.com/10/00b48a?text=+) #020108 |
