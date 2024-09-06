import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "./Home/Home";
import NotFound from "./NotFound/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import "./global.css";
import GoogleSearchSong from "./projects/google_search_a_song/GoogleSearchSong";

export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="h-full w-full .noto-sans-kr-400 min-h-0">
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/googlesearchsong" element={<GoogleSearchSong />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </div>
      </ThemeProvider>
    </>
  );
}
