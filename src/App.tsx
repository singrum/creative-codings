import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home/Home";
import { ThemeProvider } from "./components/theme-provider";
import "./global.css";
import GoogleSearchSong from "./projects/google_search_a_song/GoogleSearchSong";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/GoogleSearchSong",
      element: <GoogleSearchSong />,
    },
  ],
  { basename: "/creative-codings/" }
);

export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div className="h-full w-full .noto-sans-kr-400 min-h-0">
          <RouterProvider router={router} />
        </div>
      </ThemeProvider>
    </>
  );
}
