import { google } from "googleapis";
import { configDotenv } from "dotenv";

configDotenv();

const analyzeMessage = (callback: Function, message: String) => {
  google
    .discoverAPI(`${process.env.DISCOVERY_URL}`)
    .then((client: any) => {
      const analyzeRequest = {
        comment: {
          text: message,
        },
        requestedAttributes: {
          TOXICITY: {},
        },
      };

      client.comments.analyze(
        {
          key: process.env.API_KEY,
          resource: analyzeRequest,
        },
        (err: any, response: any) => {
          if (err) callback(err, null);
          else {
            const data: any = JSON.stringify(
              response.data,
              null,
              2
            );
            callback(null, data);
          }
        }
      );
    })
    .catch((err) => {
      throw err;
    });
};

export default analyzeMessage;