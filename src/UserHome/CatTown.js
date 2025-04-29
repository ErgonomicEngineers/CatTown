import { useState } from "react";
import House from "./House";
import GridCell from "./GridCell";
import catHouseImg from "./cat-house.png";

const initialBuildings = {
  "cat-house": { image: catHouseImg, x: null, y: null },
  "spa-house": { image: catHouseImg, x: null, y: null },
  "museum-house": { image: catHouseImg, x: null, y: null },
};

export default function CatTown() {
  const [buildings, setBuildings] = useState(initialBuildings);

  const handleDrop = (id, x, y) => {
    setBuildings((prev) => ({
      ...prev,
      [id]: { ...prev[id], x, y },
    }));
  };

  const handleReset = () => {
    setBuildings((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, data]) => [
          id,
          { ...data, x: null, y: null },
        ])
      )
    );
  };

  const grid = [];
  for (let row = 0; row < 4; row++) {
    const cells = [];
    for (let col = 0; col < 4; col++) {
      const buildingHere = Object.entries(buildings).find(
        ([, b]) => b.x === col && b.y === row
      );
      const house = buildingHere ? (
        <House
          key={buildingHere[0]}
          id={buildingHere[0]}
          image={buildingHere[1].image}
        />
      ) : null;

      cells.push(
        <GridCell key={`${col}-${row}`} x={col} y={row} onDrop={handleDrop}>
          {house}
        </GridCell>
      );
    }
    grid.push(<div style={{ display: "flex" }}>{cells}</div>);
  }

  // Render unplaced houses in a toolbar
  const unplacedHouses = Object.entries(buildings)
    .filter(([, b]) => b.x === null || b.y === null)
    .map(([id, b]) => <House key={id} id={id} image={b.image} />);

  return (
    <div className="cat-town-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h3>🏠 Drag from Inventory:</h3>
        <button onClick={handleReset} className="reset-btn">
          🔁 Reset Grid
        </button>
      </div>

      <div className="inventory-bar">
        {unplacedHouses.length ? unplacedHouses : <i>No unplaced houses</i>}
      </div>

      <h3>🗺️ Your Cat Town</h3>
      <div className="town-grid">{grid.flat()}</div>
    </div>
  );
}
