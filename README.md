<h1 align="center">
  <img alt="aircnc" src="assets/logo.png" width="250px" /><br>
  <b>aircnc: code and coffee</b> ☕
</h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/diegomais/aircnc?style=for-the-badge">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/diegomais/aircnc?style=for-the-badge">
  <img alt="GitHub license" src="https://img.shields.io/github/license/diegomais/aircnc?style=for-the-badge">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/diegomais/aircnc?style=for-the-badge">
  <img alt="GitHub Actions: Web App CI" src="https://img.shields.io/github/workflow/status/diegomais/aircnc/Web%20App%20CI?label=Web%20App%20CI&style=for-the-badge">
</p>

<p align="center">
  <a href="#rocket-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#computer-project">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#bookmark-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#seat-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#thinking-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-license">License</a>
</p>

<br>

<p align="center">
  <img alt="Mobile and web" src="assets/aircnc.png" width="100%">
</p>

## :rocket: Technologies

This project was developed with the following technologies:

- [Node.js](https://nodejs.org)
- [React](https://reactjs.org)
- [React Native](https://reactnative.dev)

Extras:

- Main Libs
  - [Express](https://expressjs.com)
  - [Mongoose ODM](https://mongoosejs.com)
  - [Next.js](https://nextjs.org)
  - [Expo](https://expo.io)
- Style
  - [EditorConfig](https://editorconfig.org)
  - [ESLint](https://eslint.org)
  - [Prettier](https://prettier.io)

## :computer: Project

**Aircnc** is a project that aims to connect companies that want to open spots and developers looking for a place to exchange ideas with devs, get to know the company and work there for a period.

## :bookmark: Layout

You can download the project layout in `.sketch` format through [this link](assets/aircnc.sketch).

To open the file in `.sketch` format on any operating system use the tool [Zeplin](https://zeplin.io).

## :seat: Getting started

These instructions will get you a copy of the full project up and running on your local machine for development and testing purposes.

### API and Web App

You can view this project immediately at [https://diegomais-aircnc.netlify.app](https://diegomais-aircnc.netlify.app).

#### Setting up the development environment

You will need to install [Git](https://git-scm.com) and [Docker](https://www.docker.com) before following the instructions below.

#### Installation using Docker Compose

The following steps need to be performed inside a terminal window (Windows user may prefer to use the [Windows Terminal](https://aka.ms/windowsterminal) but the Command Prompt will also work).

Clone the repository and build Docker images:

```bash
git clone https://github.com/diegomais/aircnc.git
cd aircnc
docker-compose build
```

#### Running the services

Use the following command to run all aircnc containers (from within the aircnc directory):

```bash
docker-compose up
```

You can now use the API at [http://localhost:3333](http://localhost:3333) and view the Web App in the browser at [http://localhost:3000](http://localhost:3000).

### Mobile

With an Android phone, you can load this project immediately at [https://expo.io/@diegomais/aircnc](https://expo.io/@diegomais/aircnc).

#### Setting up the development environment

You will need to install [npm](https://nodejs.org/en/download/) or [Yarn](https://yarnpkg.com/en/docs/install) and [Expo CLI](https://docs.expo.io/get-started/installation/) before following the instructions below.

#### Installing dependencies and running the mobile application

Run the instructions bellow inside `packages/mobile` directory:

1. `npm install`
2. `expo start`

or

1. `yarn install`
2. `expo start`

## :thinking: How to contribute

- Fork this repository;
- Create a branch with your feature: `git checkout -b my-feature`;
- Commit your changes: `git commit -m '[feat](scope) My new feature'`;
- Push to your branch: `git push origin my-feature`.

After the merge of your pull request is done, you can delete your branch.

## :memo: License

This project is under the MIT license. See the [LICENSE](LICENSE) for more details.

---

Made with :heart: by [Diego Mais](https://diegomais.github.io/) :wave:.
