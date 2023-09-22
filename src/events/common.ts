import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";
import { EmbedBuilder } from "discord.js";
import analyzeMessage from "../services/messageAnalyzer.js";

@Discord()
export class Example {
  @On()
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    if (message.author.bot) return;
    analyzeMessage((err: any, data: any) => {
      if (err) return err;
      else {
        const parsedData = JSON.parse(data);
        const toxicityIndex = parseFloat(parsedData.attributeScores.TOXICITY.summaryScore.value) * 100;
        if (toxicityIndex >= 40) {
          message.reply(
            `message: ${message.content} \n toxicity index: ${toxicityIndex} \n user: ${message.author.username}`
          );
        }
      }
    }, message.content);
  }
}