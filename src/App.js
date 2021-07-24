import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Persona from "./components/persona/persona";
import Generos from "./components/generos/generos";
import Libro from "./components/libro/libro";

function App() {
  return (
    <div className="App">
      <Router>
        <Sidebar />
        <div className="App-body">
          <Route exact path="/" component={Persona} />
          <Route exact path="/generos" component={Generos} />
          <Route exact path="/libro" component={Libro} />
        </div>
      </Router>
    </div>
  );
}

export default App;
