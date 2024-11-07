const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const adminExist = ADMINS.find(
    (admin) => admin.username == username && admin.password == password
  );

  if (adminExist) {
    next();
  } else {
    return res.status(404).json({ message: "Authentication Failed" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  const adminExsit = ADMINS.find((admin) => admin.username == username);

  if (adminExsit) {
    return res.json({ message: "user already exist" });
  } else {
    ADMINS.push({ username, password });
    res.status(201).json({ message: "Admin created successfully" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.status(200).send("Logged in successfully");
});

app.post("/admin/courses", adminAuthentication, (req, res) => {
  // logic to create a course

  const { title, description, price, imageLink, published } = req.body;

  const newCourse = {
    id: Math.floor(Math.random() * 100),
    title,
    description,
    price,
    imageLink,
    published,
  };

  COURSES.push(newCourse);

  res
    .status(201)
    .json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  // logic to edit a course
  const { courseId } = req.params;

  const course = COURSES.find((course) => course.id == courseId);

  if (course) {
    Object.assign(course, req.body);
    return res.status(200).json({ message: "Course updated successfully" });
  } else {
    return res.status(404).json({ message: "Course not found!" });
  }
});

app.get("/admin/courses", adminAuthentication, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;

  const user = USERS.find(
    (user) => user.username == username && user.password == password
  );

  if (user) {
    req.user = user;
    next();
  } else {
    return res.status(404).json({ message: "AUthentication Failed" });
  }
};

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  USERS.push({ username, password, purchasedCourses: [] });
  res.status(201).send("User created Successfully");
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json("Logged in Successfully");
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  const filteredCourses = COURSES.filter((course) => course.published);
  res.json({ courses: filteredCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const { courseId } = req.params;
  console.log(courseId, req.params);
  const user = req.user;
  const course = COURSES.find((course) => course.id == Number(courseId));
  console.log(course);
  if (course) {
    user.purchasedCourses.push(courseId);
    console.log(USERS);
    res.json({ message: "Course Purchased successfully" });
  } else {
    res.status(404).json({ message: "Course not found or not Available" });
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCoursesId = req.user.purchasedCourses;

  const purchasedCourses = purchasedCoursesId.flatMap((courseId) => {
    return COURSES.filter((course) => courseId === course.id);
  });

  console.log(purchasedCourses, purchasedCoursesId);

  if (purchasedCourses) {
    res.json({ PurchasedCourse: purchasedCourses});
  } else {
    res.send(200).json({ message: "You haven't purchased any course yet." });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
