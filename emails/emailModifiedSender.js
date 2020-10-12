const nodemailer = require("nodemailer");
const ejs = require('ejs');

module.exports = function emailModified(userId) {
    console.log('emailModified', userId);
    db.query("SELECT name, email, token  FROM users WHERE userId = ?", [userId], function(err, results) {
        // Send mail to the adress
        let contentOptions = {
            username: results[0].name,
            usermail: results[0].email,
            sendDate: new Date().toLocaleString(),
            validationLink: "https://hyperblender.be/acc/verif/" + results[0].token,
            cancelLink: "https://hyperblender.be/arr/unreg/" + results[0].token
        };
        ejs.renderFile('./emails/emailModified.ejs', contentOptions, function(err, renderedMail) {
            if (err) throw err;
            let mailOptions = {
                from: '"hyperblender" <noreply@hyperblender.be>',
                to: results[0].email,
                bcc: "loggingsentmail@hyperblender.be",
                subject: "📅 hyperblender - email modifiée",
                text: renderedMail,
                html: renderedMail
            };
            nodemailer.createTransport(config.NODEMAILER_TRANSPORTER_PARAMS).sendMail(mailOptions, function(err, info) {
                if (err) {
                    req.flash('alertDanger', 'erreur lors de l\'envoi du mail à votre adresse');
                    console.log('[Error] Email sending error :', err);
                }
            });
        })
    })
}