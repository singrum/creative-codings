import GoogleSearchSong from "./project/google_search_a_song/GoogleSearchSong";
import "./global.css";
import { Routes, Route, HashRouter } from "react-router-dom";
import NotFound from "./NotFound/NotFound";

export default function App() {
  return (
    <>
      <div className="h-full w-full .noto-sans-kr-400">
        <HashRouter>
          <Routes>
            <Route path="/GoogleSearchSong" element={<GoogleSearchSong />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </div>
    </>
  );
}
