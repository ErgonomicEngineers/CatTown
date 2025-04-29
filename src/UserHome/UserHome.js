import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CatTown from "./CatTown";

export default function UserHome() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CatTown />
    </DndProvider>
  );
}