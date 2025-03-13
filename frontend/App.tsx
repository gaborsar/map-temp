import type { LatLng } from "leaflet";
import React from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMapEvents } from "react-leaflet";
import "./App.css";

export function App() {
  const [date, setDate] = React.useState("2019-01-01");
  return (
    <>
      <div className="Map">
        <MapContainer
          center={[60, 10]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker date={date} />
        </MapContainer>
      </div>
      <div className="DateInput">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={true} />
      </div>
    </>
  );
}

const positionFormatter = new Intl.NumberFormat("en-GB", {
  style: "decimal",
  maximumFractionDigits: 3,
});
const metersFormatter = new Intl.NumberFormat("en-GB", {
  style: "unit",
  unit: "meter",
});

function LocationMarker({ date }: { date: string }) {
  const [position, setPosition] = React.useState<LatLng | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [hmax, setHmax] = React.useState(-1);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  React.useEffect(() => {
    (async () => {
      if (!position) {
        return;
      }
      setLoading(true);
      try {
        setHmax(await fetchHMax(date, position.lat, position.lng));
      } catch (e) {
        console.error(e);
        setHmax(-1);
      } finally {
        setLoading(false);
      }
    })();
  }, [date, position]);

  if (!position) {
    return null;
  }

  let tooltip: React.ReactNode;
  if (loading) {
    tooltip = "Loading...";
  } else if (hmax === -1) {
    tooltip = "No data";
  } else {
    tooltip = `Max wave height in ${date} at (${positionFormatter.format(position.lat)}, ${positionFormatter.format(position.lng)}): ${metersFormatter.format(hmax)}`;
  }

  return (
    <Marker position={position}>
      <Tooltip permanent={true}>{tooltip}</Tooltip>
    </Marker>
  );
}

async function fetchHMax(date: string, latitude: number, longitude: number): Promise<number> {
  const res = await fetch(`/api/hmax/${date}?latitude=${latitude}&longitude=${longitude}`);
  if (!res.ok) {
    throw new Error("failed to fetch hmax");
  }
  const { hmax } = (await res.json()) as { hmax: number };
  return hmax;
}
