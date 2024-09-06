import React, { useState } from "react";
import { Filter } from "lucide-react";
import { cn } from "../lib/utils";
import moment from "moment";
import { Badge } from "../components/ui/badge";

const tags: string[] = [
  "R3F",
  "three.js",
  "PixiJS",
  "Matter.js",
  "ammo.js",
  "Blender",
  "ARCore",
  "WebGL",
];

const works: {
  name: string;
  imgSrc: string;
  date: moment.Moment;
  path: string;
  tag: string[];
}[] = [
  {
    path: "./#/GoogleSearchSong",
    name: "Google Audio Visualizer",
    imgSrc: "./img/googlesearchsong.png",
    date: moment("20240706"),
    tag: ["R3F", "three.js"],
  },
  {
    path: "https://singrum.github.io/pixijsnote/notes/note1_BZ/BZ",
    name: "BZ Reaction",
    imgSrc: "./img/bz_reaction.png",
    date: moment("20230725"),
    tag: ["PixiJS"],
  },
  {
    path: "https://singrum.github.io/pixijsnote/notes/note2_metaball/metaball",
    name: "Blur Metaball",
    imgSrc: "./img/blur_metaball.png",
    date: moment("20230826"),
    tag: ["PixiJS"],
  },
  {
    path: "https://singrum.github.io/pixijsnote/notes/note5_equipotential/index",
    name: "Equipotential Metaball",
    imgSrc: "./img/equipotential_metaball.png",
    date: moment("20230826"),
    tag: ["PixiJS"],
  },
  {
    path: "https://singrum.github.io/pixijsnote/notes/note11_RSP5/",
    name: "Rock Scissors Paper",
    imgSrc: "./img/rsp.png",
    date: moment("20240210"),
    tag: ["Matter.js"],
  },
  {
    path: "https://singrum.github.io/threejsnote/notes/note40_Saturn/Saturn",
    name: "Saturn",
    imgSrc: "./img/saturn.png",
    date: moment("20230528"),
    tag: ["three.js"],
  },
  {
    path: "https://singrum.github.io/threejsnote/notes/note38_screw_bar",
    name: "Screw Bar",
    imgSrc: "./img/screw_bar.png",
    date: moment("20230527"),
    tag: ["three.js"],
  },
  {
    path: "https://singrum.github.io/threejsnote/notes/note33_ferris_wheel",
    name: "Ferris Wheel",
    imgSrc: "./img/ferris_wheel.png",
    date: moment("20230503"),
    tag: ["three.js"],
  },
  {
    path: "https://singrum.github.io/threejsnote/notes/note32_rainbow",
    name: "Rainbow",
    imgSrc: "./img/rainbow.png",
    date: moment("20230429"),
    tag: ["three.js"],
  },
  {
    path: "https://singrum.github.io/threejsnote/notes/note30_dandelion",
    name: "Dandelion",
    imgSrc: "./img/dandelion.png",
    date: moment("20230421"),
    tag: ["three.js"],
  },
  {
    path: "https://singrum.github.io/ammojsnote/notes/note08_candy_factory",
    name: "Candy",
    imgSrc: "./img/candy.png",
    date: moment("20230415"),
    tag: ["three.js", "ammo.js"],
  },
  {
    path: "https://singrum.github.io/ammojsnote/notes/note07_mc_bee",
    name: "Minecraft Bee",
    imgSrc: "./img/mc_bee.png",
    date: moment("20230325"),
    tag: ["three.js", "ammo.js"],
  },
  {
    path: "https://singrum.github.io/ammojsnote/notes/note03_domino_simulator",
    name: "Domino Simulator",
    imgSrc: "./img/domino.jpg",
    date: moment("20230225"),
    tag: ["three.js", "ammo.js"],
  },
  {
    path: "https://singrum.github.io/ARCoreNote/notes/koong/koong_model_view",
    name: "ARCore Koongya",
    imgSrc: "./img/koong.png",
    date: moment("20230728"),
    tag: ["Blender", "ARCore"],
  },
  {
    path: "https://singrum.github.io/webGLnote/notes/note2_camouflage/camo",
    name: "Camouflage",
    imgSrc: "./img/camouflage.png",
    date: moment("20230709"),
    tag: ["WebGL"],
  },
  {
    path: "https://singrum.github.io/growingblock2/",
    name: "3d Snake Game",
    imgSrc: "./img/3d_snake.png",
    date: moment("20230325"),
    tag: ["three.js"],
  },
  {
    path: "https://singrum.github.io/not-tetris-2-clone/",
    name: "Not Tetris Clone",
    imgSrc: "./img/not_tetris.png",
    date: moment("20221227"),
    tag: ["Matter.js"],
  },
  {
    path: "https://singrum.github.io/threejsnote/notes/note18_globe",
    name: "Morphing Globe",
    imgSrc: "./img/morphing_globe.png",
    date: moment("20230226"),
    tag: ["three.js"],
  },
];

export default function Home() {
  const [checked, setChecked] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex gap-2 w-full border-b border-border items-center p-5 justify-between">
        <div
          className="text-xl font-bold text-primary cursor-pointer"
          onClick={() => location.reload()}
        >
          Creative Codings
        </div>

        <div
          className="flex flex-col text-xs font-semibold cursor-pointer"
          onClick={() => window.open("https://github.com/singrum")}
        >
          <div>Kang</div>
          <div>Hyomin</div>
        </div>
      </div>
      <div className="flex-1 flex min-h-0">
        <div className="min-h-0 border-border border-r w-[200px] p-2 hidden md:block">
          <div className="w-full">
            <div className="flex gap-1 text-muted-foreground items-center p-3">
              <span>
                <Filter className="w-4 h-4" />
              </span>
              <div className="text-sm">필터</div>
            </div>
            <div className="flex flex-col gap-1">
              {tags.map((e, i) => (
                <React.Fragment key={i}>
                  <div
                    className={cn(
                      "w-full hover:bg-accent cursor-pointer px-2 py-1 rounded-md",
                      { "bg-accent text-primary": checked === e }
                    )}
                    onClick={() => {
                      checked === e ? setChecked(null) : setChecked(e);
                    }}
                  >
                    {e}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 p-5 overflow-auto">
          <ul className="w-full flex flex-wrap gap-y-6 sm:gap-x-[calc(100%-((100%/2-6px)*2))] md:gap-x-[calc(100%-((100%/3-5px)*3))] lg:gap-x-[calc(100%-((100%/4-4px)*4))]">
            {(!checked
              ? works
              : works.filter((e) => e.tag.some((t) => t === checked))
            ).map((e, i) => (
              <React.Fragment key={i}>
                <li
                  className="sm:w-[calc(100%/2-6px)] md:w-[calc(100%/3-10px)] lg:w-[calc(100%/4-12px)] flex flex-col gap-2 cursor-pointer"
                  onClick={() => window.open(e.path)}
                >
                  <div className="text-muted-foreground text-xs">
                    {e.date.format("YYYY년 MM월")}
                  </div>

                  <img
                    src={e.imgSrc}
                    className={`object-cover aspect-video rounded-lg w-full bg-cover bg-center`}
                  />
                  <div className="text-md hover:underline">{e.name}</div>

                  <div className="text-muted-foreground flex flex-nowrap gap-1">
                    {e.tag.map((t, i) => (
                      <React.Fragment key={i}>
                        <Badge
                          className="text-muted-foreground"
                          variant={"secondary"}
                        >
                          {t}
                        </Badge>
                      </React.Fragment>
                    ))}
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
