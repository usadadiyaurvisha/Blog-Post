import { useContext } from "react";
import "./Footer.css";
import ModeContext from "../context/ModeContext";

function Footer() {
  const currentYear = new Date().getFullYear(); // Current year
  const ctx = useContext(ModeContext); // Dark/Light mode context

  return (
    <footer className={`footer ${ctx.mode}`}>
      <p>&copy; {currentYear} Your Website Name</p>
    </footer>
  );
}

export default Footer;
