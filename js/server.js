const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();


// body parser middleware
app.use(express.json());
app.use(express.urlencoded( { extended: false } )); // this is to handle URL encoded data
// end parser middleware


// custom middleware to log data access
const log = function (request, response, next) {
	console.log(`${new Date()}: ${request.protocol}://${request.get('host')}${request.originalUrl}`);
	console.log(request.body); // make sure JSON middleware is loaded first
	next();
}
app.use(log);
// end custom middleware


// enable static files pointing to the folder "public"
// this can be used to serve the index.html file
app.use(express.static(path.join(__dirname, "public")));


// HTTP POST
app.post("/ajax/email", function(request, response) {
  // create reusable transporter object using the default SMTP transport
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "your_account@gmail.com", // this should be YOUR GMAIL account
			pass: "your_password" // this should be your password
		}
	});

	var textBody = `FROM: ${request.body.name} EMAIL: ${request.body.email} MESSAGE: ${request.body.message}`;
	var htmlBody = `<h2>Mail From Contact Form</h2><p>from: ${request.body.name} <a href="mailto:${request.body.email}">${request.body.email}</a></p><p>${request.body.message}</p>`;
	var mail = {
		from: "your_account@gmail.com", // sender address
		to: "your_account@gmail.com", // list of receivers (THIS COULD BE A DIFFERENT ADDRESS or ADDRESSES SEPARATED BY COMMAS)
		subject: "Mail From Contact Form", // Subject line
		text: textBody,
		html: htmlBody
	};

	// send mail with defined transport object
	transporter.sendMail(mail, function (err, info) {
		if(err) {
			console.log(err);
			response.json({ message: "message not sent: an error occured; check the server's console log" });
		}
		else {
			response.json({ message: `message sent: ${info.messageId}` });
		}
	});
});


// set port from environment variable, or 8000
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

