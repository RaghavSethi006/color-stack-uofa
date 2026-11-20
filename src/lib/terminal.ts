import type { SiteEvent } from "../config/site";
import { content as c } from "../content";
import { splitEvents } from "./events";

export type CommandAction = "clear" | "join" | "theme";

export type CommandResult = {
  output: string;
  action?: CommandAction;
};

export function evaluateCommand(cmd: string, events: readonly SiteEvent[], now: Date = new Date()): CommandResult {
  const [rawName = "", ...rest] = cmd.trim().split(/\s+/);
  const name = rawName.toLowerCase();

  switch (name) {
    case "":
      return { output: "" };
    case "help":
      return {
        output: "commands: help whoami ls cat about programs summit events join theme clear sudo",
      };
    case "whoami":
      return { output: "black_and_latinx_students --in computing --at uofa" };
    case "ls":
      return { output: "community/  academics/  careers/  summit/" };
    case "cat":
      return {
        output: rest[0]?.toLowerCase() === "about" ? c.about.paragraphs.join("\n\n") : "usage: cat about",
      };
    case "programs":
      return {
        output: c.programs.items.map((p) => `[${p.name.toLowerCase()}] ${p.title}`).join("\n"),
      };
    case "summit":
      return {
        output: `${c.summit.label}: six members, YEG -> SFO, ${c.summit.route.distance.toLowerCase()}.`,
      };
    case "events": {
      const { upcoming } = splitEvents(events, now);
      return {
        output: upcoming.length
          ? upcoming.map((e) => `${e.start.slice(0, 10)}  ${e.title} @ ${e.location}`).join("\n")
          : "nothing on the calendar yet. follow @colorstackuofa.",
      };
    }
    case "join":
      return { output: "opening ./join ...", action: "join" };
    case "theme":
      return { output: "", action: "theme" };
    case "clear":
      return { output: "", action: "clear" };
    case "sudo":
      return { output: "nice try. permissions are earned at study night." };
    default:
      return { output: `command not found: ${name}. try \`help\`` };
  }
}
