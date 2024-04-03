import {Link, useLocation} from "react-router-dom";
import {IoIosLogIn, IoIosLogOut} from "react-icons/io";
import {Container} from "../components/Container.jsx";
import Popup from "reactjs-popup";
import {useState} from "react";

const contentStyle = {
    background: "#fff",
    fontSize: "24px",
    padding: "20px",
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
    borderRadius: "12px"
};
const overlayStyle = {background: "rgba(0,0,0,0.5)"};
export const Home = () => {
    const closeModal = () => setOpen(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const signedIn = queryParams.get("signin");
    const signedOut = queryParams.get("signout");
    const [open, setOpen] = useState(signedIn || signedOut);
    return (
        <Container>
            <Popup open={open} closeOnDocumentClick onClose={closeModal} modal contentStyle={contentStyle}
                   overlayStyle={overlayStyle}>
                <div className="modal"><a className="close" onClick={closeModal}>            &times;          </a>
                    {signedIn && <>Thanks for signing in, {signedIn}!</>}
                    {signedOut && <>{signedOut}, you have successfully signed out.</>}
                </div>
            </Popup>
            <div
                className="flex flex-col lg:flex-row h-screen justify-center items-center space-y-4 lg:space-y-0 lg:space-x-4 p-16">
                <Link
                    to="/signin"
                    className="flex justify-center items-center bg-blue-500 text-white font-bold py-2 px-4 rounded w-full h-1/2 text-6xl"
                >
                    <IoIosLogIn className="mr-2"/>
                    Sign In
                </Link>

                <Link
                    to="/signout"
                    className="flex justify-center items-center bg-blue-500 text-white font-bold py-2 px-4 rounded w-full h-1/2 text-6xl"
                >
                    <IoIosLogOut className="mr-2"/>
                    Sign Out
                </Link>
            </div>
        </Container>
    );
};