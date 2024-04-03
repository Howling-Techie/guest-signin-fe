import {useEffect, useState} from "react";
import {Combobox} from "@headlessui/react";
import {Container} from "../components/Container.jsx";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import {FaCheck} from "react-icons/fa6";
import {LuChevronsUpDown} from "react-icons/lu";
import {getActiveSessions, signGuestOut} from "../../services/API.js";
import {useNavigate} from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const SignOut = () => {
    const [query, setQuery] = useState("");
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        getActiveSessions().then(res => {
            setSessions(res.sessions);
        });

    }, []);

    const filteredSessions =
        query === ""
            ? sessions
            : sessions.filter((session) => {
                return session.guest.name.toLowerCase().includes(query.toLowerCase());
            });
    const [name, setName] = useState("");
    const [satisfied, setSatisfied] = useState(true);
    const [feedback, setFeedback] = useState("");
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [selectedInput, setSelectedInput] = useState(null);
    const [keyboardState, setKeyboardState] = useState(null);

    const inputHandlers = {
        name: {
            "{bksp}": () => setName(name.slice(0, -1)),
            "{space}": () => setName(name + " "),
            default: (input) => setName(name + input)
        },
        feedback: {
            "{bksp}": () => setFeedback(feedback.slice(0, -1)),
            "{space}": () => setFeedback(feedback + " "),
            default: (input) => setFeedback(feedback + input)
        }
    };

    const handleKeyboardInput = (input) => {
        switch (input) {
            case "{enter}":
            case "{tab}":
                setSelectedInput(null);
                setKeyboardState(null);
                setShowKeyboard(false);
                break;
            case "{shift}":
                setKeyboardState(keyboardState === "{shift}" ? null : "{shift}");
                break;
            case "{lock}":
                setKeyboardState(keyboardState === "{lock}" ? null : "{lock}");
                break;
            default:
                if (keyboardState) {
                    switch (keyboardState) {
                        case "{shift}":
                            input = input.toUpperCase();
                            setKeyboardState(null);
                            break;
                        case "{lock}":
                            input = input.toUpperCase();
                            break;
                    }
                }
                if (selectedInput && inputHandlers[selectedInput][input]) {
                    inputHandlers[selectedInput][input]();
                } else if (selectedInput && inputHandlers[selectedInput].default) {
                    inputHandlers[selectedInput].default(input);
                }
                break;
        }
    };

    const enableSignOut = selectedSession;

    const navigate = useNavigate();

    const handleSignOut = () => {
        const signOut = (id) => {
            signGuestOut(id, {
                guest: id,
                checkOutTime: (new Date()).toISOString(),
                feedback,
                satisfied
            })
                .then(() => {
                    navigate(`/?signout=${selectedSession.guest.name}`);
                })
                .catch((error) => {
                    console.error(error);
                });
        };
        signOut(selectedSession.id);
    };
    return (
        <Container>
            <h2 className="text-2xl mb-4">Sign Out</h2>
            <div className="flex justify-center w-full">
                <div className="rounded-lg border shadow-xl w-full max-w-4xl">
                    <div className="p-4">
                        <div className="flex space-y-2 flex-col">
                            <Combobox id="name-select" as="div" value={selectedSession}
                                      onChange={setSelectedSession}>
                                <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Select
                                    a guest</Combobox.Label>
                                <div className="relative mt-2">
                                    <Combobox.Input
                                        className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(event) => setQuery(event.target.value)}
                                        displayValue={(session) => session?.guest.name}
                                    />
                                    <Combobox.Button
                                        className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                        <LuChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                    </Combobox.Button>

                                    {filteredSessions.length > 0 && (
                                        <Combobox.Options
                                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredSessions.map((session) => (
                                                <Combobox.Option
                                                    key={session.id}
                                                    value={session}
                                                    className={({active}) =>
                                                        classNames(
                                                            "relative cursor-default select-none py-2 pl-3 pr-9",
                                                            active ? "bg-indigo-600 text-white" : "text-gray-900"
                                                        )
                                                    }
                                                >
                                                    {({active, selected}) => (
                                                        <>
                                                                    <span
                                                                        className={classNames("block truncate", selected && "font-semibold")}>{session.guest.name}</span>

                                                            {selected && (
                                                                <span
                                                                    className={classNames(
                                                                        "absolute inset-y-0 right-0 flex items-center pr-4",
                                                                        active ? "text-white" : "text-indigo-600"
                                                                    )}
                                                                >
                        <FaCheck className="h-5 w-5" aria-hidden="true"/>
                      </span>
                                                            )}
                                                        </>
                                                    )}
                                                </Combobox.Option>
                                            ))}
                                        </Combobox.Options>
                                    )}
                                </div>
                            </Combobox>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Did you get what you wanted out of your visit today?
                                </label>
                                <div className="mt-2 rounded-md shadow-sm h-[24px] w-[128px] flex">
                                    <input
                                        type="checkbox"
                                        name="satisfied"
                                        id="satisfied"
                                        className="h-full w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6"
                                        defaultChecked={true}
                                        onChange={(e => setSatisfied(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Feedback
                                </label>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="feedback"
                                        id="feedback"
                                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        onChange={(e => setFeedback(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                className="disabled:bg-gray-300 disabled:text-gray-600 border rounded-xl p-2 bg-blue-600 text-white shadow-xl disabled:shadow-gray-500/20 shadow-blue-500/20"
                                onClick={handleSignOut} disabled={!enableSignOut}>Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showKeyboard &&
                <div className="w-full flex justify-center">
                    <div className="pt-2 w-full max-w-4xl"><Keyboard onKeyPress={handleKeyboardInput}
                                                                     layoutName={keyboardState === "{shift}" || keyboardState === "{lock}" ? "shift" : "default"}/>
                    </div>
                </div>}
        </Container>
    );
};