// @ts-ignore
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import GamePage  from "../pages/GamePage";
import Leaderboard  from "../pages/LeaderBoard";


export const router = createBrowserRouter([
    {path: "/", element: <Home />},
    {path: "/game", element: <GamePage />},
    {path: "/leaderboard", element: <Leaderboard />},
]);

export const ROUTES = {
    HOME: "/",
    GAME: "/game",
    LEADERBOARD: "/leaderboard",
};