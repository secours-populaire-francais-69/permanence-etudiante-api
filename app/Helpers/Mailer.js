const Env = use("Env");
const mailPublicKey = Env.get("MAILJET_PUBLIC_KEY");
const mailPrivateKey = Env.get("MAILJET_PRIVATE_KEY");
const nodeEnv = Env.get("NODE_ENV");
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
 *        templateId:
 *          type: number
 *        templateLanguage:
 *          type: boolean
 *        variables:
 *          type: object
 *          additionalProperties:
 *            type: string
 *      required:
 *        - to
 *        - subjbect
 *        - templateId
 *        - templateLanguage
 *        - variables
 */
const mailer = async ({
  to: To,
  subjbect: Subject,
  templateId: TemplateId,
  templateLanguage: TemplateLanguage,
  variables: Variables,
}) => {
  if (nodeEnv === "testing") return true;
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "quentin.basset@querio.fr",
          Name: "spf",
        },
        To,
        Subject,
        TemplateId,
        TemplateLanguage,
        Variables,
      },
    ],
  });
};

module.exports = mailer;
