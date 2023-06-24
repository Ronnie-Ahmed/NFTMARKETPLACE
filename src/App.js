import "./App.css";
import { Header } from "./Components/Header";
import { Footer } from "./Components/Footer";
import { Allroutes } from "./Components/Allroutes";

function App() {
  return (
    <div>
      <Header />
      <div className="bg-gray-400">
        <Allroutes />
      </div>
      <Footer />
    </div>
  );
}

export default App;
