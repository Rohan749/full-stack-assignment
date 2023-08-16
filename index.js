import express from "express"
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()
const port = 3000;

const USERS = [
  {name: "admin", password: "123"},
  {name: "user", password: "123"}
];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
},
{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
      input: "[1,2,3,4,5]",
      output: "5"
  }]
},
];

const SUBMISSION = []

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})


app.post('/signup', function(req, res) {
  let name = req.body.name;
  USERS.forEach(element => {
    if(element.name === name) {
      res.send("This name already exists. Try a different name")
    }
  });
  USERS.push(req.body)
  res.send(`Welcome ${name} to the community!`)
  console.log(USERS)
})


app.post('/login', function(req, res) {
  let name = req.body.name;
  let password = req.body.password;
  const user = USERS.find((user) => user.name === name);

  if (!user || user.password !== password) {
    return res.status(401).send('Invalid credentials.');
  }
  const token = Math.random().toString(36).substring(7);

  console.log('Access token:', token)
  res.send(`<html>
  <body>
  <h1>Welcome to the community</h1>
  <h2>Name: ${name}</h2>
  <a href="/questions">Questions</a>
  </body>
  <div>
    ${name === 'admin' ? 
    `<form method='post' action='/questions'>
    <h2>Add a new problem statement:</h2>
    <div><input name='title' placeholder='Title of the question:'/></div>
    <div><input name='description' placeholder='Describe the question:' /></div>
    <div><input name='testcase' placeholder='Enter the testcases:'/></div>
    <div><input name='output' placeholder='Enter the expected output:' /></div>
    <h3>
    <button type='submit'>Add this question to the list.</button>
    </h3>
    </form>`:'<div />'}
  </div>
</html>`)
})

app.post('/questions', (req, res) => {
  res.send(`
  This question is posted. <a href="/questions">Checkout in the Problems list.</a>
  `)
  console.log(req.body.title)
  QUESTIONS.push(
    {
      title: req.body.title,
      description: req.body.description,
      testCases: [{
        input: req.body.testcase,
        output: req.body.output
      }]
    }
  )

})

app.get('/questions', function(req, res) {

  const questionData = ` <html>
  <head>
    <title>Questions</title>
  </head>
  <body>
    <h1>Questions List</h1>
    <ul>
      ${QUESTIONS.map((question) => `
        <li>
          <h2>${question.title}</h2>
          <p>${question.description}</p>
          <h3>Test Cases:</h3>
          <ul>
            ${question.testCases.map((testCase) => `
              <li>
                <strong>Input:</strong> ${testCase.input}<br>
                <strong>Output:</strong> ${testCase.output} <br>
                <a href="/submissions">
                <button>Submit your answer</button>
                </a>
              </li>
            `)}
          </ul>
        </li>
      `)}
    </ul>
  </body>
  </html>`
  res.send(questionData)
})


app.get("/submissions", function(req, res) {
  
  res.send(`<html>
  <form method="post" action="/submissions">
    <textarea name="answer" id="answerid"
    style="width: 100%; 
    height: 200px; 
    padding: 10px; 
    font-size: 16px;"
    >type your code</textarea>
    <button type="submit">Submit</button>
    </form>
  </html>`)

});


app.post("/submissions", function(req, res) {

  const status = Math.random() < 0.5;
  const acceptedStatement = status ? "Your answer is accepted" : "Wrong answer. Please try again."

  SUBMISSION.push(req.body)
  console.log(SUBMISSION)
  
  res.send(acceptedStatement)

});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
  console.log(USERS)
})