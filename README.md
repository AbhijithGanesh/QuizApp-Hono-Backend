# QuizApp Backend

This is the backend service for the QuizApp, designed to manage quizzes, questions, and user responses. It provides a RESTful API for creating, updating, and fetching quiz data.

## Installation

Before running the service, ensure you have Bun installed on your system. Then, install the project dependencies with:

```sh
bun install
```

Running the Service
To start the backend service, use the following command:

```sh
bun run dev
```

After starting the service, it will be available at <http://localhost:3000>.

## API Endpoints

- `GET /`: Home endpoint, returns a greeting message.
- `GET /get-all-questions`: Fetches all questions with options.
- `POST /upload-questions`: Allows uploading a list of questions.
- `POST /post-options`: Endpoint to post options for questions.
- `POST /post-answers`: Submit answers for questions.
- `POST /return-scores`: Returns the score based on submitted answers.

## Docker Support

To simplify deployment and ensure consistency across different environments, this project includes Docker support. Below are the steps to build and run the QuizApp backend using Docker.

### Building the Docker Image

1. Navigate to the root directory of the project.
2. Build the Docker image using the following command:

```sh
docker build -t quizapp-backend .
```

This command builds a Docker image named quizapp-backend based on the instructions in the Dockerfile.

Running the Service in a Docker Container
After building the image, you can run the QuizApp backend inside a Docker container using:

```sh
docker run -d -p 3000:3000 quizapp-backend
```

## Tech Stack

The QuizApp backend is built using a modern technology stack to ensure high performance, scalability, and ease of development. Below is an overview of the key technologies used:

- **Bun**: Used as the runtime environment, Bun offers exceptional performance and a wide range of built-in functionalities, making it an ideal choice for building fast and efficient web services.

- **TypeScript**: The backend is written in TypeScript, providing strong typing and modern JavaScript features, which enhances code quality and developer productivity.

- **Docker**: Docker containers are used to encapsulate the service's environment, ensuring consistency across development, testing, and production deployments.

- **Hono**: Hono is a Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.

- **SQLite**: SQLite is a file based database

This combination of technologies provides a solid foundation for building and scaling the QuizApp backend, ensuring that it can handle large volumes of traffic and data efficiently.

## Contributing

Contributions to the QuizApp backend are welcome. Please ensure to follow the project's code standards and submit your pull requests for review.

## License

This project is licensed under the BSD-III License - see the LICENSE file for details.
