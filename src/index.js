const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const db = require('./config/db'); 
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;
const userRoutes = require('./routes/UserRoutes');
const adminRoutes = require('./routes/adminRoutes');


app.use("/api",userRoutes);
app.use("/api/admin",adminRoutes);
//means there is no need for test for public folder if it is /public in url and static means it is static folder by default assign to express.
app.use('/public', express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
