import { Request, Response } from "express";
var formData = require("form-data");
var Mailgun = require("mailgun.js");
var mailgun = new Mailgun(formData);


export async function sendConfirmationEmail(req: Request, res: Response) { 
    var mg = mailgun.client({
      username: "api",
      key: "089249374f169f7c9de871f75de3c026-2175ccc2-1970a282",
    });
    mg.messages
      .create("medicares.me", {
        from: "hna <infos@medicares.me>",
        to: "chihebrahmouni30@gmail.com",
        subject: "Hello",
        text: "Testing some Mailgun awesomeness!",
        html: "<h1>Testing some Mailgun awesomeness!</h1>",
      })
      .then(function (msg : any) {
        return console.log("message is : " + msg);
      })
      .catch(function (err :  any) {
        return console.log("error is: " + err);
      }); 
};


/*export async function sendConfirmationEmail(req: Request, res: Response) {
    //const { email } = req.body;
    //const confirmationCode = Math.floor(Math.random() * 1000000); 
  const mailgun = Mailgun({
  apiKey: "089249374f169f7c9de871f75de3c026-2175ccc2-1970a282",
  domain: "medicares.me",
});
    const data = {
      from: "chiheb rahmouni <chihebrahmouni31@gmail.com>",
      to: "chihebrahmouni30@gmail.com",
      subject: "Email Confirmation",
      text: `Your confirmation code is: 123456`,
    };

    try {
        await mailgun.messages().send(data);
        res.json({ test: "passed" });
    } catch (error: any) {
        res.status(500).json({ "error found": error.message });
    }
}*/

export function verifyConfirmationCode(req: Request, res: Response) {
    const { confirmationCode, userConfirmationCode } = req.body;

    if (confirmationCode === userConfirmationCode) {
        res.json({ message: 'Confirmation successful' });
    } else {
        res.status(400).json({ message: 'Invalid confirmation code' });
    }
}