const Env = use("Env");
const mailPublicKey = Env.get("MAILJET_PUBLIC_KEY");
const mailPrivateKey = Env.get("MAILJET_PRIVATE_KEY");
const mailjet = require("node-mailjet").connect(mailPublicKey, mailPrivateKey);

/**
 *  @swagger
 *  definitions:
 *    Mail:
 *      type: object
 *      properties:
 *        to:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              Name:
 *                type: string
 *              Email:
 *                type: string
 *                format: email
 *        subjbect:
 *          type: string
 *        textPart:
 *          type: string
 *        htmlPart:
 *          type: string
 *        customId:
 *          type: string
 *      required:
 *        - to
 *        - subjbect
 *        - textPart
 *        - htmlPart
 *        - customId
 */
const mailer = async ({
  to: To,
  subjbect: Subject,
  textPart: TextPart,
  htmlPart: HTMLPart,
  customId: CustomID,
}) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "quentin.basset@querio.fr",
          Name: "quentin",
        },
        To,
        Subject,
        TextPart,
        HTMLPart,
        CustomID,
      },
    ],
  });
};

module.exports = mailer;
