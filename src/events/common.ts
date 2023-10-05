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
        const toxicityIndex =
          parseInt(parsedData.attributeScores.TOXICITY.summaryScore.value) * 100;
        if (toxicityIndex >= 0) {
          message.delete()
          const embed: EmbedBuilder = new EmbedBuilder()
            .setColor("#212945")
            .setTitle("Toxicity detected")
            .setThumbnail(
              "https://cdn.discordapp.com/avatars/" +
                message.author.id +
                "/" +
                message.author.avatar +
                ".jpeg"
            )
            .addFields(
              { name: "User", value: `<@${message.author.id}>` },
              {
                name: "Toxicity index",
                value: `${toxicityIndex}`,
                inline: false,
              },
              {
                name: "Detected language",
                value: `${parsedData.detectedLanguages[0]}`,
                inline: true,
              },
              {
                name: "Type",
                value: `${parsedData.attributeScores.TOXICITY.summaryScore.type}`,
                inline: true,
              }
            )
            .setTimestamp()
            .setFooter({
              text: "Auditra",
              iconURL:
                "https://avatars.githubusercontent.com/u/145500157?s=200&v=4",
            });
          message.reply({ embeds: [embed] });
        }
      }
    }, message.content);
  }
}