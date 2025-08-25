// Student Info stored in an object
const student = {
  name: "Julius Herrera",
  major: "Advanced Computer Science",
  email: "Julius@uat.edu",
  graduationDate:  "2027"
};

// Insert student info into HTML elements
document.getElementById("name").textContent = student.name;
document.getElementById("major").textContent = `Major: ${student.major}`;
document.getElementById("email").textContent = `Email: ${student.email}`;
document.getElementById("grad-date").textContent = `Expected Graduation: ${student.graduationDate}`;
