import { h, render } from "preact";
import { App } from "./components/app";

const app = document.createElement("div");
app.id = "app";
document.body.append(app);

render(<App />, app);
