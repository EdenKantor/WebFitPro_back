# Installation and Setup

This guide provides step-by-step instructions to set up the WebFitPro project, which consists of two parts:

- **Frontend**: Built with Preact (Vite)
- **Backend**: Built with Next.js

Both parts should be placed under a main folder named `webfitpro`, with the following structure:

```
webfitpro/
├── frontend/   # Preact (Vite) project
├── backend/    # Next.js project
```

## Prerequisites

Before starting, ensure that you have the following installed:

- **Node.js and npm** (Check by running: `node -v` and `npm -v`)
- **Git** (Check by running: `git --version`)

## 1. Clone the Repositories

Open a terminal and run the following commands to clone both repositories into the correct structure:

### 1.1 Clone the Frontend Repository

```bash
git clone https://github.com/EdenKantor/WebFitPro_front.git webfitpro/frontend
```

### 1.2 Clone the Backend Repository

```bash
git clone https://github.com/EdenKantor/WebFitPro_back.git webfitpro/backend
```

After running these commands, your project structure should look like this:

```
webfitpro/
├── frontend/   
├── backend/
```

## 2. Install Dependencies

### 2.1 Install Frontend Dependencies

Navigate to the `frontend` folder and install the required dependencies:

```bash
cd webfitpro/frontend
npm install
```

### 2.2 Install Backend Dependencies

Navigate to the `backend` folder and install the required dependencies:

```bash
cd ../backend
npm install
```

## 3. Set Up Environment Variables for Backend

The backend requires a MongoDB connection string to function properly.

1. Inside the `backend` directory, create a new file named `.env.local`:

   ```bash
   touch .env.local
   ```

2. Open the file and add the following line (replace `your-mongodb-uri` with your actual MongoDB connection string):

   ```bash
   MONGODB_URI=your-mongodb-uri
   ```

   **You can use our MongoDB Connection String:**
      ```bash
   MONGODB_URI=mongodb+srv://User1:Group10@webfitpro-cluster.alf8p.mongodb.net/webfitproDB?retryWrites=true&w=majority&appName=webfitpro-cluster
   ```

## 4. Running the Project

### 1. Start the Backend Server

Navigate to the backend directory and start the server:

```bash
cd webfitpro/backend
npm run dev
```

By default, the backend will run on [http://localhost:3000](http://localhost:3000).

### 2. Start the Frontend Server

Open a new terminal window, navigate to the frontend directory, and start the frontend server:

```bash
cd webfitpro/frontend
npm run dev
```

By default, the frontend will run on [http://localhost:5173](http://localhost:5173).

