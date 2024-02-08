import express from "express";
import cors from "cors";
import userServices from "./user-services.js";

const app = express();
const port = 8000;

app.use(cors({
    methods: ['GET', 'POST', 'DELETE'], // Add 'DELETE' here
}));
app.use(express.json());

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userServices.addUser(userToAdd)
    .then(addedUser => res.status(201).json(addedUser))
    .catch(err => res.status(500).send(err));
  });

app.get("/users/:id", (req, res) => {
    const id = req.params.id; //or req.params.id
    userServices.findUserById(id)
      .then(user => {
        if (!user) {
          res.status(404).send("User not found");
        } else {
          res.send(user);
        }
      })
      .catch(err => res.status(500).send(err));
  });



  app.get("/users", (req, res) => {
    const { name, job } = req.query;

    if (name && job) {
    // Check for name and job
    userServices.findUsersByNameAndJob(name, job)
      .then(users => res.send(users))
      .catch(err => res.status(500).send(err));
  } else {
    // All other cases
    userServices.getUsers(name, job)
      .then(users => res.send(users))
      .catch(err => res.status(500).send(err));
  }
});

app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    userServices.deleteUser(id)
      .then(() => res.status(204).send("User deleted"))
      .catch(err => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});