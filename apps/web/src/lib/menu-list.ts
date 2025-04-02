import { Users, Home, LucideIcon, Gamepad2Icon } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Home",
          icon: Home,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Games",
      menus: [
        {
          href: "/games",
          label: "Game",
          icon: Gamepad2Icon,
          submenus: [
            {
              href: "/games/new-game",
              label: "Create Game",
            },
            {
              href: "/games/edit-game",
              label: "Edit Game",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Scores",
      menus: [
        {
          href: "/leaderboards",
          label: "LeaderBoards",
          icon: Users,
        },
      ],
    },
  ];
}
