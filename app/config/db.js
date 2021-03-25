// Database Connection
dbPassword = process.env.MONGODB_URI
    
module.exports = {
    mongoURI: dbPassword
};
