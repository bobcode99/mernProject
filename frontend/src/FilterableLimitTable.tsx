import { useState } from "react";

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
        </>
    );
};

export default FilterableLimitTable;
