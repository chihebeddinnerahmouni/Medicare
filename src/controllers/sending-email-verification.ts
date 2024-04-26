const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);


const mg = mailgun.client({
  username: "api",
  key: "1f9325e1ce077f207d5da525390703b6-2175ccc2-ebc5f9c6",
});

mg.messages
  .create("medicares.me", {
    from: "Excited User <mailgun@medicares.me>",
    to: "chihebrahmouni@gmail.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>",
  })
  .then((msg: any) => console.log(msg)) // logs response data
  .catch((err: any) => console.log(err)); // logs any error
