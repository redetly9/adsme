import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import { Box } from "@mui/joy"

export const Main = () => {
    return <>
        <Box sx={{
            maxHeight: 'calc(100dvh - 81.6px)',
            height: '100%',
        }}>
            <Outlet />
        </Box>
        <NavBar />
    </>
}