import app from "./app.js";
// import { connectDB } from './db/knexfile.js';


async function startServer() {
  //   await connectDB();
  const PORT = Number(process.env.PORT) || 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
