import GoogleSearchSong from "./projects/google_search_a_song/GoogleSearchSong";
import "./global.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import NotFound from "./NotFound/NotFound";
import Home from "./Home/Home";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
