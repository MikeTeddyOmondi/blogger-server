const Transporter = require('nodemailer')
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

// Send email to Admin's inbox  
async function sendMail(mail_body) {
    try {
        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID, // ClientID
            process.env.CLIENT_SECRET, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        )

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        })

        const senderMail = process.env.SENDER_EMAIL
        const recipientMail = process.env.RECIPIENT_EMAIL

        let message_body = ''

        if (mail_body.message) {
            const body = `
            <h5>${mail_body.name} sent an inquiry message from the contact form of your website</h5>
            <br>
            <p>You can contact ${mail_body.name} using the below additional contact</p>
            <ul>
                <li>Email: ${mail_body.email} </li>
                <li>Phone number: ${mail_body.phone}</li>
            </ul>
            <br>
            <p>${mail_body.name}' inquiry message is: </p>
            <h5>${mail_body.message}</h5>
            <br>
            <p>Regards,</p>
            <h5>Dynasty | Bloggers Org.</h5> 
            `
            message_body = body
        } else {
            const body = `
            <h5>${mail_body.name} subscribed to your newsletters from your website</h5>
            <br>
            <p>You can contact ${mail_body.name} using the below additional contact</p>
            <ul>
                <li>Email: ${mail_body.email} </li>
            </ul>
            <br>
            <p>Regards,</p>
            <h5>Dynasty | Bloggers Org.</h5> 
            `
            message_body = body
        }

        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = Transporter.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: senderMail,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: senderMail,
            to: recipientMail,
            subject: 'New Notification - Dynasty | Bloggers Org.',
            text: `Hi, ${message_body}`,
            html: `<h5>Hi, ${message_body}</h5>`
        }

        const emailSent = await transporter.sendMail(mailOptions)
        return emailSent

    } catch (err) {
        console.log(`Error occurred while sending the email: ${err.message}`)
    }
}

// Send email to User's inbox  
async function autoContactMail(mail_body) {
    try {
        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID, // ClientID
            process.env.CLIENT_SECRET, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        )

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        })

        const senderMail = process.env.SENDER_EMAIL
        const recipientMail = mail_body.email

        let message_body = ''

        const body = `
            <h5>Hi ${mail_body.name},</h5>
            <br>
            <p>Thank you for contacting Dynasty | Bloggers Org. Your inquiry message has truly been received. You will receive more feedback as soon as your mail is addressed.</p>
            <br>
            <p>Regards,</p>
            <h5>Brandon Lio</h5>
            <h5>Dynasty | Bloggers Org.</h5>
            `
        message_body = body

        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = Transporter.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: senderMail,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: senderMail,
            to: recipientMail,
            subject: 'Thanks for Contacting - Dynasty | Bloggers Org.',
            text: `${message_body}`,
            html: `<h5>${message_body}</h5>`
        }

        const emailSent = await transporter.sendMail(mailOptions)
        return emailSent

    } catch (err) {
        console.log(`Error occurred while sending the email: ${err.message}`)
    }
}

// Send email to User's inbox  
async function autoSubscribeMail(mail_body) {
    try {
        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID, // ClientID
            process.env.CLIENT_SECRET, // Client Secret
            "https://developers.google.com/oauthplayground" // Redirect URL
        )

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN
        })

        const senderMail = process.env.SENDER_EMAIL
        const recipientMail = mail_body.email

        let message_body = ''

        const body = `
            <h5>Hi ${mail_body.name},</h5>
            <br>
            <p>Thank you for subscribing to my newsletters.</p>
            <p>You'll always be notified on scheduled posts yet to be published and blogs that are already published courtesy of joining my community.</p>
            <br>
            <p>Regards,</p>
            <h5>Brandon Lio</h5>
            <h5>Dynasty | Bloggers Org.</h5>
            `
        message_body = body

        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = Transporter.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: senderMail,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        const mailOptions = {
            from: senderMail,
            to: recipientMail,
            subject: 'Thanks for Contacting - Dynasty | Bloggers Org.',
            text: `${message_body}`,
            html: `<h5>${message_body}</h5>`
        }

        const emailSent = await transporter.sendMail(mailOptions)
        return emailSent

    } catch (err) {
        console.log(`Error occurred while sending the email: ${err.message}`)
    }
}

module.exports = { sendMail, autoContactMail, autoSubscribeMail }