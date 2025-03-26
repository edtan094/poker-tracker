import { Users, CirclePlus, Home, LucideIcon } from "lucide-react";

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
      groupLabel: "",
      menus: [
        {
          href: "/games",
          label: "Create New Game",
          icon: CirclePlus,
        },
      ],
    },
    {
      groupLabel: "",
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
