//========================================
// Puerto
//========================================
process.env.PORT = process.env.PORT || 3000;

//========================================
// Vencimiento token
//========================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//========================================
// Seed
//========================================
process.env.SEED = process.env.SEED || "development-seed";

//========================================
// Environment
//========================================
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//========================================
// Database
//========================================
let urlDB;

if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB = process.env.MONGO_URI;
}

//========================================
// Google client
//========================================
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "437296965636-vlj46sf6c84emhk0ufq7pip9hsr7pnp7.apps.googleusercontent.com";

process.env.URLDB = urlDB;
