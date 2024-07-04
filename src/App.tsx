import GoogleSearchSong from "./project/google_search_a_song/GoogleSearchSong";
import "./global.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./NotFound/NotFound";

export default function App() {
  return (
    <>
      <div className="h-full w-full .noto-sans-kr-400">
        <BrowserRouter>
          <Routes>
            <Route path="GoogleSearchSong" element={<GoogleSearchSong />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
