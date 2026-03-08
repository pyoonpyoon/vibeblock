import VibeBlock from "../../VibeBlock-demo.jsx";
import VibeBlockPitch from "../../VibeBlock-pitch.jsx";

const isPitch = new URLSearchParams(window.location.search).has("pitch");
export default function App() { return isPitch ? <VibeBlockPitch /> : <VibeBlock />; }
