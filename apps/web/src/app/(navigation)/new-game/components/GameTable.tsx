import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type GameTableProps = {
  players: any[];
  handleDelete: (index: number) => void;
};

export default function GameTable({ players, handleDelete }: GameTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span>Player</span>
          </TableHead>
          <TableHead>
            <span>Buy Ins</span>
          </TableHead>
          <TableHead>
            <span>Gains/Losses</span>
          </TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player, index) => {
          return (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.buyIns}</TableCell>
              <TableCell>{player.gainsLosses}</TableCell>
              <TableCell>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
