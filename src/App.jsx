import ErrorPage from "./ErrorPage.jsx";
import {Route, Routes} from "react-router-dom";
import {Home} from "./routes/Home.jsx";
import {SignIn} from "./routes/SignIn.jsx";
import {SignOut} from "./routes/SignOut.jsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signout" element={<SignOut/>}/>
            <Route path="*" element={<ErrorPage/>}/>
        </Routes>
    );
}