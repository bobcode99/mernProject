import { useEffect, useState } from "react";
import { ILimitation } from "./types/type";

export type LimitsResponse = {
    posts: Array<ILimitation>;
};

const LimitList = (props: { limits: ILimitation }) => {
    const handleButtonClick = (id: number) => {
        console.log(id);
    };
    return (
        <>
            <ul className="space-x-5">
                <li className="float-left">
                    <strong>ID:</strong> {props.limits.id}
                </li>
                <li className="float-left">
                    <strong>Name:</strong> {props.limits.name}
                </li>
                <li className="float-left">
                    <strong>Description:</strong> {props.limits.description}
                </li>
                <li className="float-left">
                    <strong>Status:</strong>{" "}
                    {props.limits.status ? "Active" : "Inactive"}
                </li>
                <li className="float-left">
                    <strong>Version:</strong> {props.limits.version}
                </li>
                <li className="float-left">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                        onClick={() => handleButtonClick(props.limits.id)}
                    >
                        Click
                    </button>
                </li>
            </ul>
            <br />
        </>
    );
};
type SearchBarProps = {
    filterText: string;
    byId: boolean;
    byName: boolean;
    onFilterTextChange: (text: string) => void;
    onByIdChange: (idChecked: boolean) => void;
    onByNameChange: (nameChecked: boolean) => void;
};

const SearchBar = ({
    filterText,
    byId,
    byName,
    onFilterTextChange,
    onByIdChange,
    onByNameChange,
}: SearchBarProps) => {
    return (
        <>
            <form>
                <input
                    className="placeholder:italic block bg-white py-2 pl-9 pr-3 border rounded-md shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                    type="text"
                    value={filterText}
                    placeholder="Search..."
                    onChange={(e) => onFilterTextChange(e.target.value)}
                />
                <div className="space-x-5">
                    <label>
                        <input
                            type="checkbox"
                            checked={byId}
                            onChange={(e) => onByIdChange(e.target.checked)}
                        />{" "}
                        Search by id
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={byName}
                            onChange={(e) => onByNameChange(e.target.checked)}
                        />{" "}
                        Search by name
                    </label>
                </div>
            </form>
        </>
    );
};

const FilterableLimitTable = () => {
    const [filterText, setFilterText] = useState("");
    const [byId, setbyId] = useState(false);
    const [byName, setbyName] = useState(false);
    const [limits, setLimits] = useState<ILimitation[]>([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8889/api/limitations")
            .then((res) => res.json())
            .then((json) => {
                setLimits(json.limitations);
                console.log("json: ", json);
            });
    }, []);

    return (
        <>
            <SearchBar
                filterText={filterText}
                byId={byId}
                byName={byName}
                onFilterTextChange={setFilterText}
                onByIdChange={setbyId}
                onByNameChange={setbyName}
            />
            {limits.map((limit) => (
                <LimitList key={limit.id} limits={limit} />
            ))}
        </>
    );
};

export default FilterableLimitTable;
