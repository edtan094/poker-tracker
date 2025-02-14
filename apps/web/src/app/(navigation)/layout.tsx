import Nav from "@/components/Nav";
import { NavLink } from "@/components/Nav";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/games">Game</NavLink>
        <NavLink href="/leaderboards">Leaderboards</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
