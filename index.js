const Joi = require("joi");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

const courses = [
  { id: 1, name: "Course1" },
  { id: 2, name: "Course2" },
  { id: 3, name: "Course3" },
];

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body.name);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course); // Sending the newly created course
});

app.put("/api/courses/:id", (req, res) => {
  // Step 1
  const course = courses.find((x) => x.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course Not Found!");

  // Step 2
  const { error } = validateCourse(req.body.name);
  if (error) return res.status(400).send(error.details[0].message);

  // Step 3
  course.name = req.body.name;
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Step 1
  const course = courses.find((x) => x.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("Course Not Found!");

  // Step 2
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Step 3
  res.send(course);
});

function validateCourse(result) {
  const schema = Joi.string().min(3).required();
  return schema.validate(result);
}

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((x) => x.id === parseInt(req.params.id));
  if (!course) return res.status(400).send("Course Not Found!");
  res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}...`));
