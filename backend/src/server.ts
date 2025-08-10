import app from "./app.js";
// import { connectDB } from './db/knexfile.js';

const PORT = process.env.PORT || 3001;

async function startServer() {
  //   await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
