//========================================
// Puerto
//========================================
process.env.PORT = process.env.PORT || 3000;

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
  urlDB =
    "mongodb+srv://cafeUser:nmrJfRNslXoxhT8y@cluster0-eazvq.azure.mongodb.net/cafe?retryWrites=true&w=majority";
}

process.env.URLDB = urlDB;
