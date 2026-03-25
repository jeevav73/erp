require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  
      Digital Agency ERP Backend              
      Server running on port ${PORT}           
      Environment: ${process.env.NODE_ENV}                
   
  `);
  console.log("Server starting...")
});
