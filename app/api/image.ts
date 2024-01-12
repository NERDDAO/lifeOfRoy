import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const AUTH_TOKEN = process.env.MIDJOURNEY_AUTH_TOKEN;
const endpoint = `https://api.thenextleg.io/v2`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.body;
  const data = JSON.stringify({
    msg: text,
    ref: "",
    webhookOverride: "",
    ignorePrefilter: "false",
  });

  const config = {
    method: "post",
    url: "https://api.thenextleg.io/v2/imagine",
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      console.log(error);

      res.status(error.response.status || 500).json({ message: error.message });
    });
}
