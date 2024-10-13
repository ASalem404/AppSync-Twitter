# Full-Stack Serverless Twitter Clone

This project demonstrates how to build a **scalable and performant full-stack serverless application** using modern technologies like **AWS AppSync, AWS Lambda, Amazon Cognito, Amazon DynamoDB, and Vue.js**. We will create a Twitter clone from scratch to explore how these technologies can be combined to deliver highly performant, cost-efficient, and scalable applications.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technologies](#technologies)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Deploying the Application](#deploying-the-application)
7. [Testing](#testing)
8. [Contributing](#contributing)
9. [License](#license)

## Project Overview

The goal of this project is to showcase how to build a **serverless** Twitter-like application using AWS services and Vue.js. We will use:

- **AWS AppSync** for the GraphQL API and real-time communication.
- **AWS Lambda** to handle business logic and custom resolvers.
- **Amazon DynamoDB** as the scalable NoSQL database to store user and tweet data.
- **Vue.js** for the frontend, ensuring a modern, dynamic user interface.

## Architecture

The architecture of the application follows a full serverless approach. Here's a high-level overview of the components:

- **AppSync**: GraphQL API with real-time subscriptions for tweets and interactions.
- **Lambda**: Backend logic and data processing.
- **DynamoDB**: Highly scalable, fully managed NoSQL database.
- **Vue.js**: Frontend built using Vue.js, communicating with the AppSync API.

## Technologies

- **AWS AppSync** (GraphQL API)
- **AWS Lambda** (Serverless compute)
- **Amazon DynamoDB** (NoSQL Database)
- **Amazon Cognito** (Authentication Service)
- **Vue.js** (Frontend framework)
- **Amplify** (AWS Amplify for easier setup and deployment)

## Getting Started

To get started with the project, you need to have the following tools installed:

- [Node.js](https://nodejs.org/)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Amplify CLI](https://docs.amplify.aws/cli/start/install/)

### Clone the Repo

```bash
git clone https://github.com/ASalem404/AppSync-Twitter.git
cd  AppSync-Twitter
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for discussion.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
