
import express from 'express';
import  {createUser}  from './controller/usercontroller';


const app = express();
const port = 3333;

app.use(express.json());

app.post("/user" , createUser)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
