// Unified terminal commands configuration
// Used by both InteractiveTerminal and TerminalPrompt components

export interface TerminalCommand {
  route: string;
  description: string;
}

// Full command definitions with routes and descriptions
export const TERMINAL_COMMANDS: Record<string, TerminalCommand> = {
  "cd ~": { route: "/", description: "go home" },
  cd: { route: "/", description: "go home" },
  "ls -la thoughts/": { route: "/?tab=thoughts", description: "read my blog" },
  thoughts: { route: "/?tab=thoughts", description: "read my blog" },
  whoami: { route: "/?tab=me", description: "about me" },
  "cat about.md": { route: "/?tab=me", description: "about me" },
  me: { route: "/?tab=me", description: "about me" },
  "ls -la projects/": {
    route: "/?tab=open-source",
    description: "open source projects",
  },
  projects: { route: "/?tab=open-source", description: "open source projects" },
  "cat travels.log": {
    route: "/?tab=digital-nomad",
    description: "digital nomad journey",
  },
  travels: {
    route: "/?tab=digital-nomad",
    description: "digital nomad journey",
  },
  help: { route: "", description: "show available commands" },
  clear: { route: "", description: "clear terminal" },
};

// Mapping from tab/section names to display commands
// Used by TerminalPrompt to show the "current" command based on URL
export const TAB_TO_COMMAND: Record<string, string> = {
  thoughts: "ls -la thoughts/",
  me: "cat about.md",
  "open-source": "ls -la projects/",
  "digital-nomad": "cat travels.log",
};

// Help text for the terminal
export const TERMINAL_HELP_TEXT = `available commands:
  cd ~              go home
  ls -la thoughts/   read my blog
  whoami            about me
  ls -la projects/  open source projects
  cat travels.log   digital nomad journey
  clear             clear terminal
  help              show this message

shortcuts: thoughts, me, projects, travels`;
