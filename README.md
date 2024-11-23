# Word-to-PDF Converter App

This project is a **Word-to-PDF Converter Application** built with a React frontend and a Node.js backend. The application provides an interface to upload `.docx` files and convert them to `.pdf` format. Both the frontend and backend are dockerized and published as images on Docker Hub.

---

## **Features**
- Upload `.docx` files and convert them to `.pdf`.
- Optional password protection for generated PDFs.
- Responsive frontend built with React.
- Backend API built with Node.js and Express.
- Fully containerized using Docker.

---

## **Technologies Used**
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Containerization**: Docker & Docker Compose
- **Deployment**: AWS EC2

---

## **Docker Images**
- **Frontend Image**: [`alokverma20/client-app`](https://hub.docker.com/r/alokverma20/client-app)
- **Backend Image**: [`alokverma20/server-app`](https://hub.docker.com/r/alokverma20/server-app)

---

## **Installation**

### **Local Development Setup**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/word-to-pdf.git
   cd word-to-pdf
2. Make sure the README.md file exists in the root directory of the project:
    ```bash
    ls README.md
3. Install dependencies for the server and client:

    ```bash
    cd server
    npm install
    cd ../client
    npm install
4. Start the backend:

    ```bash
    cd server
    npm start
5. Start the frontend:
    ```bash
    cd client
    npm start
6. Open the application in your browser:

    ```
    http://localhost:3000

## **Docker Compose Setup**
1. Build and start the containers:
    ```bash
    docker-compose up --build -d
2. Access the frontend at:
    ```bash
    http://localhost:3000
3. The backend will be running at:
    ```bash
    http://localhost:4000

## **Environment Variables**

To configure the application, you can set the following environment variables:

| Variable           | Description                        | Default Value           |
|--------------------|------------------------------------|-------------------------|
| `REACT_APP_API_URL`| Backend API URL for the frontend   | `http://localhost:4000` |
| `PORT` (server)    | Port for the backend server        | `4000`                  |

## **API Endpoints**

### **POST /convert**
- **Description**: Converts a `.docx` file to `.pdf`.
- **Request Body**:
  ```json
  {
    "filePath": "/path/to/file.docx",
    "password": "optional-password"
  }
- **Response**
    ```json
    {
        "message": "File converted successfully.",
        "downloadUrl": "http://localhost:4000/download/converted-file.pdf"
    }

### **GET/download/:fileName**
- **Description**: Downloads the converted PDF file.
- **Response**: PDF file.

---

## **Deployment**
### **Deploy Using Docker**
1. Pull the images from Docker Hub:
    ```bash
    docker pull alokverma20/client-app
    docker pull alokverma20/server-app
2. Start the containers:
    ```bash
    docker run -d -p 3000:3000 alokverma20/client-app
    docker run -d -p 4000:4000 alokverma20/server-app
3. Access the application:
    - **Frontend**: `http://<your-server-ip>:3000`
    - **Backend**: `http://<your-server-ip>:4000`
---

## **Deploy to AWS EC2**
1. SSH into your EC2 instance.
2. Install Docker and Docker Compose:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose -y
3. Copy your project or `docker-compose.yml` to the instance.
4. Start the application
    ```bash
    docker-compose up -d
---
## **Docker Hub Links**

- **Frontend Docker Image**: [alokverma20/client-app](https://hub.docker.com/r/alokverma20/client-app)
- **Backend Docker Image**: [alokverma20/server-app](https://hub.docker.com/r/alokverma20/server-app)
## **Contributors**
- **Alok Verma**

Feel free to reach out for any suggestions or improvements! 🚀
