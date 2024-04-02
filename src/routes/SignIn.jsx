import {useEffect, useState} from "react";
import {Combobox} from "@headlessui/react";
import {Container} from "../components/Container.jsx";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import {FaCheck} from "react-icons/fa6";
import {LuChevronsUpDown} from "react-icons/lu";
import {createGuest, getGuests, signGuestIn} from "../../services/API.js";
import {useNavigate} from "react-router-dom";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export const SignIn = () => {
    const [query, setQuery] = useState("");
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        getGuests().then(res => {
            console.log(res.guests);
            setPeople(res.guests);
        });

    }, []);

    const filteredPeople =
        query === ""
            ? people
            : people.filter((person) => {
                return person.name.toLowerCase().includes(query.toLowerCase());
            });
    const [name, setName] = useState("");
    const [from, setFrom] = useState("");
    const [contact, setContact] = useState("");
    const [reason, setReason] = useState("");
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [selectedInput, setSelectedInput] = useState(null);
    const [keyboardState, setKeyboardState] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);

    const inputHandlers = {
        name: {
            "{bksp}": () => setName(name.slice(0, -1)),
            "{space}": () => setName(name + " "),
            default: (input) => setName(name + input)
        },
        email: {
            "{bksp}": () => setContact(contact.slice(0, -1)),
            "{space}": () => setContact(contact + " "),
            default: (input) => setContact(contact + input)
        },
        reason: {
            "{bksp}": () => setReason(reason.slice(0, -1)),
            "{space}": () => setReason(reason + " "),
            default: (input) => setReason(reason + input)
        },
        from: {
            "{bksp}": () => setFrom(from.slice(0, -1)),
            "{space}": () => setFrom(from + " "),
            default: (input) => setFrom(from + input)
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

    const enableSignIn = currentTab === 1 ? name && contact && reason : selectedPerson;

    const navigate = useNavigate();

    const handleSignIn = () => {
        const signIn = (id) => {
            signGuestIn(id, {
                guest: id,
                checkInTime: (new Date()).toISOString(),
                reason: reason
            })
                .then(() => {
                    navigate("/");
                })
                .catch((error) => {
                    console.error(error);
                });
        };

        switch (currentTab) {
            case 0:
                signIn(selectedPerson.id);
                break;
            case 1:
                createGuest({name, source: from, email: contact})
                    .then(result => {
                        signIn(result.guest.id);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
                break;
            default:
                return;
        }
    };
    const tabs = ["Returning Guest", "New Guest"];


    return (
        <Container>
            <h2 className="text-2xl mb-4">Sign In</h2>
            <div className="flex justify-center w-full">
                <div className="rounded-lg border shadow-xl w-full max-w-4xl">
                    <div className="sm:hidden">
                        <label htmlFor="tabs" className="sr-only">
                            Select a tab
                        </label>
                        <select
                            id="tabs"
                            name="tabs"
                            className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                            defaultValue={tabs[0]}
                            onChange={(e) => setCurrentTab(e.target.value === "New Guest" ? 1 : 0)}
                        >
                            {tabs.map((tab) => (
                                <option key={tab} value={tab}>{tab}</option>
                            ))}
                        </select>
                    </div>
                    <div className="hidden sm:block">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex" aria-label="Tabs">
                                {tabs.map((tab, tabIdx) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setCurrentTab(tab === "New Guest" ? 1 : 0);
                                            setCurrentTab(tabIdx);
                                        }}
                                        className={classNames(
                                            currentTab === tabIdx
                                                ? "border-indigo-500 text-indigo-600"
                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                                            "w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium"
                                        )}
                                        aria-current={currentTab === tabIdx ? "page" : undefined}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>
                    <div className="p-4">
                        {currentTab === 1 ?
                            (
                                <div className="flex space-y-2 flex-col">
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Name
                                        </label>
                                        <div className="relative mt-2 rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="John Smith"
                                                onFocus={() => {
                                                    setShowKeyboard(true);
                                                    setSelectedInput("name");
                                                }}
                                                value={name}
                                                onChange={(e => setName(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Email
                                        </label>
                                        <div className="relative mt-2 rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="email"
                                                id="email"
                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="john.smith@email.com"
                                                onFocus={() => {
                                                    setShowKeyboard(true);
                                                    setSelectedInput("email");
                                                }}
                                                value={contact}
                                                onChange={(e => setContact(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            From
                                        </label>
                                        <div className="relative mt-2 rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="from"
                                                id="from"
                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Warrington Collegiate"
                                                onChange={(e => setFrom(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium leading-6 text-gray-900">
                                            Reason for Visit
                                        </label>
                                        <div className="relative mt-2 rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="reason"
                                                id="reason"
                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Volunteering"
                                                onChange={(e => setReason(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex space-y-2 flex-col">
                                    <Combobox id="name-select" as="div" value={selectedPerson}
                                              onChange={setSelectedPerson}>
                                        <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">Select
                                            a guest</Combobox.Label>
                                        <div className="relative mt-2">
                                            <Combobox.Input
                                                className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                onChange={(event) => setQuery(event.target.value)}
                                                displayValue={(person) => person?.name}
                                            />
                                            <Combobox.Button
                                                className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                                                <LuChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                                            </Combobox.Button>

                                            {filteredPeople.length > 0 && (
                                                <Combobox.Options
                                                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                                    {filteredPeople.map((person) => (
                                                        <Combobox.Option
                                                            key={person.id}
                                                            value={person}
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
                                                                        className={classNames("block truncate", selected && "font-semibold")}>{person.name}</span>

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
                                            Reason for Visit
                                        </label>
                                        <div className="relative mt-2 rounded-md shadow-sm">
                                            <input
                                                type="text"
                                                name="reason"
                                                id="reason"
                                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                placeholder="Volunteering"
                                                onChange={(e => setReason(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        <div className="pt-4">
                            <button
                                className="disabled:bg-gray-300 disabled:text-gray-600 border rounded-xl p-2 bg-blue-600 text-white shadow-xl disabled:shadow-gray-500/20 shadow-blue-500/20"
                                onClick={handleSignIn} disabled={!enableSignIn}>Sign In
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