//to,from,subject,text
const mailer = require('nodemailer');

///function

const sendingMail = async(to,subject,text) => {

    const transporter = mailer.createTransport({
        service: 'gmail',
        auth:{
            user:"ddhpatel4@gmail.com",
            pass:"twatvgxwtxcejbxq"
        }
    })

    const mailOptions = {
        from: 'ddhpatel4@gmail.com',
        to: to,   //"alt.hq-eovua7qn@yopmail.com"for the demo mail
        subject: subject,
        // text: text
        html:text
        //html:"<h1>"+text+"</h1>"
    }

    const mailresponse = await transporter.sendMail(mailOptions);
    console.log(mailresponse);
    return mailresponse;

}

module.exports ={
    sendingMail
}
// sendingMail("ddhpatel4@gmail.com","Test Mail","this is test mail")
