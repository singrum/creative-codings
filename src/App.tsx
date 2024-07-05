import GoogleSearchSong from "./project/google_search_a_song/GoogleSearchSong";
import "./global.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NotFound from "./NotFound/NotFound";
import GoogleSearchSongTutorial from "./project/google_search_a_song_tutorial/GoogleSearchSongTutorial";

export default function App() {
  return (
    <>
      <div className="h-full w-full .noto-sans-kr-400">
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="GoogleSearchSong" element={<GoogleSearchSong />} />
            <Route
              path="GoogleSearchSongTutorial"
              element={<GoogleSearchSongTutorial />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
