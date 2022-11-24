require("dotenv").config();

const imgURL = process.env.IMG_URL
const baseUrl = process.env.BASE_URL

const ownerEmailTemplateUtil = (bookingId, date, ownerFullname, clientFullname, phone, email) => {
    return `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <title> Notificatin [TREKR] </title>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
            #outlook a {
                padding: 0;
            }
    
            body {
                margin: 0;
                padding: 0;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }
    
            img {
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
                -ms-interpolation-mode: bicubic;
            }
    
            p {
                display: block;
                margin: 13px 0;
            }
        </style>
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet" type="text/css" />
        <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,700);
        </style>
        <style type="text/css">
            @media only screen and (min-width:480px) {
                .mj-column-per-100 {
                    width: 100% !important;
                    max-width: 100%;
                }
    
                .mj-column-per-50 {
                    width: 50% !important;
                    max-width: 50%;
                }
            }
        </style>
        <style type="text/css">
            @media only screen and (max-width:480px) {
                table.mj-full-width-mobile {
                    width: 100% !important;
                }
    
                td.mj-full-width-mobile {
                    width: auto !important;
                }
            }
        </style>
        <style type="text/css">
            a,
            span,
            td,
            th {
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }
        </style>
    </head>
    
    <body style="background-color:#f3f3f5;">
        <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Preview - Notification from TREKR </div>
        <div style="background-color:#f3f3f5;">
            <div style="margin:0px auto;max-width:600px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                    <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="font-size:0px;word-break:break-word;">
                                                    <div style="height:20px;">   </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="background:#54595f;background-color:#54595f;margin:0px auto;border-radius:4px 4px 0 0;max-width:600px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#54595f;background-color:#54595f;width:100%;border-radius:4px 4px 0 0;">
                    <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <div style="margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                        <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                                                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="width:150px;">
                                                                                        <img height="auto" src=${imgURL} style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:200px;font-size:13px;" width="150" />
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="font-size:0px;word-break:break-word;">
                                                                        <div style="height:20px;">   </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-bottom:0px;word-break:break-word;">
                                                                        <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:24px;font-weight:400;line-height:30px;text-align:center;color:#ffffff;">
                                                                            <h1 style="margin: 0; font-size: 24px; line-height: normal; font-weight: 400;">You got a new booking</h1>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:0;word-break:break-word;">
                                                                        <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:center;color:#aaaaaa;">
                                                                            <p style="margin: 0;">Order Number: ${bookingId} | Order Date: ${date} </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                        <p style="border-top: solid 1px #999999; font-size: 1px; margin: 0px auto; width: 100%;">
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                        <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:left;color:#ffffff;">
                                                                            <p style="margin: 0;">Hi, ${ownerFullname} <br /> You have a new booking. Please find the client info below. </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                        <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td style="vertical-align:top;padding:0px 25px;">
                                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#34393E;" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="left" class="receipt-table" style="font-size:0px;padding:30px;word-break:break-word;">
                                                                                        <table cellpadding="0" cellspacing="0" width="100%" border="0" style="color:#000000;font-family:Roboto, Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;border:none;">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <th colspan="3" style="font-size: 20px; line-height: 30px; font-weight: 500; color: #fff; padding: 0px 0px 10px 0px; text-align: center; border-bottom: 1px solid #555;" align="center">Client info </th>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; width: 60%; padding-top: 10px;" width="60%"> Fullname </td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right"></td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right"> ${clientFullname} </td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; width: 60%; padding-top: 10px;" width="60%"> Phone Number </td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right"></td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">${phone}</td>
                                                                                                </tr>
                                                                                                <tr>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; width: 60%; padding-top: 10px;" width="60%"> Email </td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right"></td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; text-align: right; width: 20%;" width="20%" align="right">${email}</td>
                                                                                                </tr>
    
                                                                                                <tr>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; border-bottom-width: 1px; border-bottom-color: #555; border-bottom-style: solid; padding-top: 10px;"></td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; border-bottom-width: 1px; border-bottom-color: #555; border-bottom-style: solid; padding-top: 10px;"></td>
                                                                                                    <td style="color: #ccc; font-size: 15px; line-height: 22px; font-weight: 400; word-break: normal; border-bottom-width: 1px; border-bottom-color: #555; border-bottom-style: solid; padding-top: 10px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div style="margin:0px auto;max-width:600px;">
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                                        <tbody>
                                            <tr>
                                                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
                                                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0;line-height:0;text-align:left;display:inline-block;width:100%;direction:ltr;">
                                                        <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:50%;">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" bgcolor="#2e58ff" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#2e58ff;" valign="middle">
                                                                                            <a href="${baseUrl}/calendar?
              id=${bookingId}&date=${date}" style="word-break: normal; display: inline-block; background: #2e58ff; color: white; font-family: Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: normal; line-height: 20px; margin: 0; text-decoration: none; text-transform: none; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Estimate </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div class="mj-column-per-50 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:none;vertical-align:top;width:50%;">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="right" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td align="center" bgcolor="#72787E" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#72787E;" valign="middle">
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                                                            <div style="font-family:Roboto, Helvetica, Arial, sans-serif;font-size:14px;font-weight:400;line-height:20px;text-align:left;color:#ffffff;">
                                                                                <p style="margin: 0;">You're receiving this email because you got a new booking at TREKR. If you have any questions, contact us at <a href="#" style="color: #009BF9; text-decoration: none; word-break: normal;">help@trekr.com</a></p>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="margin:0px auto;max-width:600px;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                    <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                                <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                                        <tbody>
                                            <tr>
                                                <td style="font-size:0px;word-break:break-word;">
                                                    <div style="height:1px;">   </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    
    
    </body>
    
    </html>`
}

module.exports = ownerEmailTemplateUtil