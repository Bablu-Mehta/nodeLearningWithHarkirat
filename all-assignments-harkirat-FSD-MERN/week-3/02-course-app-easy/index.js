const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const JWT = require("jsonwebtoken");

app.use(express.json());
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const ADMIN_SECRET = "Admin secret";

const generateJWTAdmin = (user) => {
  payload = { username: user.username };
  const token = JWT.sign(payload, ADMIN_SECRET, { expiresIn: "1h" });
  return token;
};

const adminAuthentication = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(" ")[1];

    JWT.verify(token, ADMIN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      next();
    });
  }

  // const adminExist = ADMINS.find(
  //   (admin) => admin.username == username && admin.password == password
  // );

  // if (adminExist) {
  //   next();
  // } else {
  //   return res.status(404).json({ message: "Authentication Failed" });
  // }
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
    const token = generateJWTAdmin({ username, password });
    res.status(201).json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;

  const adminExsit = ADMINS.find((admin) => admin.username == username);
  if (adminExsit) {
    const token = generateJWTAdmin(adminExsit);
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.status(404).send("Login failed");
  }
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

const USER_SECRET = "User secret";

const generateJWTUser = (user) => {
  payload = { username: user.username };
  const token = JWT.sign(payload, USER_SECRET, { expiresIn: "1h" });
  return token;
};

const userAuthentication = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(" ")[1];
    JWT.verify(token, USER_SECRET, (err, user) => {
      if (err) {
        return res.status(403).send(err);
      }

      const userExist = USERS.find((item) => item.username == user.username);

      if (userExist) {
        req.user = userExist;
        next();
      }
    });
  }

  // const user = USERS.find(
  //   (user) => user.username == username && user.password == password
  // );

  // if (user) {
  //   req.user = user;
  //   next();
  // } else {
  //   return res.status(404).json({ message: "AUthentication Failed" });
  // }
};

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  USERS.push({ username, password, purchasedCourses: [] });
  const token = generateJWTUser({ username, password });
  res.status(201).send({ message: "User created Successfully", token });
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  const { username, password } = req.body;
  const userExist = USERS.find(
    (user) => user.username == username && user.password == password
  );
  if (userExist) {
    const token = generateJWTUser({ username, password });
    return res.json({ message: "Logged in Successfully", token });
  } else {
    return res.status(404).send("Not able to login");
  }
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  const filteredCourses = COURSES.filter((course) => course.published);
  res.json({ courses: filteredCourses });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  const { courseId } = req.params;
  const user = req.user;
  const course = COURSES.find((course) => course.id == Number(courseId));
  if (course) {
    user.purchasedCourses.push(courseId);
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


  if (purchasedCourses) {
    res.json({ PurchasedCourse: purchasedCourses });
  } else {
    res.send(200).json({ message: "You haven't purchased any course yet." });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
