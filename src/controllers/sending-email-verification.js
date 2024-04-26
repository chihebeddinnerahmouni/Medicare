var formData = require("form-data");
var Mailgun = require("mailgun.js");
var mailgun = new Mailgun(formData);

var mg = mailgun.client({
    username: "api",
    key: "089249374f169f7c9de871f75de3c026-2175ccc2-1970a282",
});
mg.messages
    .create("medicares.me", {
    from: "Excited User <chihebrahmouni31@gmail.com>",
    to: "chihebrahmouni30@gmail.com",
    subject: "Hello",
    text: "Testing some Mailgun awesomeness!",
    html: "<h1>Testing some Mailgun awesomeness!</h1>",
})
    .then(function (msg) { return console.log(msg); })
    .catch(function (err) { return console.log(err); }); 