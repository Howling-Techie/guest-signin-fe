import {Link} from "react-router-dom";
import {IoIosLogIn, IoIosLogOut} from "react-icons/io";
import {Container} from "../components/Container.jsx";

export const Home = () => {
    return (
        <Container>
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