db.students.remove({});
db.students.insertMany([{
  "email": "n.terpetrosyan.y@tumo.org",
  "firstName": "Nazeli",
  "lastName": "Ter-Petrosyan",
  "password": "123456",
  "learningTargets": [
    "Programming",
    "Web Development",
    "Robotix",
    "Writing"
  ],
  "location": "Yerevan"
}, {
  "email": "mesrobk2@gmail.com",
  "firstName": "Martin",
  "lastName": "Kyurkchyan",
  "password": "password",
  "learningTargets": [
    "Web Development",
  ],
  "location": "Gyumri"
}
])

db.students.createIndex({ lastName: "text", firstName: "text", location: "text" })
db.students.createIndex({ learningTargets: 1})
