import { useState } from "react";

export const PRODUCTS: Product[] = [
    { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
    { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
    { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
    { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
    { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
    { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

type Product = {
    category: string;
    price: string;
    stocked: boolean;
    name: string;
};

type FilterableProductTableProps = {
    products: Product[];
};

type ProductTableProps = {
    products: Product[];
    filterText: string;
    inStockOnly: boolean;
};
type ProductRowProps = {
    product: Product;
};

type CategoryProps = {
    category: string;
};

type SearchBarProps = {
    filterText: string;
    inStockOnly: boolean;
    onFilterTextChange: (text: string) => void;
    onInStockOnlyChange: (checked: boolean) => void;
};

function SearchBar({
    filterText,
    inStockOnly,
    onFilterTextChange,
    onInStockOnlyChange,
}: SearchBarProps) {
    return (
        <>
            <form>
                <input
                    type="text"
                    value={filterText}
                    placeholder="Search..."
                    onChange={(e) => onFilterTextChange(e.target.value)}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => onInStockOnlyChange(e.target.checked)}
                    />{" "}
                    Only show products in stock
                </label>
            </form>
        </>
    );
}

function ProductCategoryRow({ category }: CategoryProps) {
    return (
        <tr>
            <th colSpan={2}>{category}</th>
        </tr>
    );
}
function ProductRow({ product }: ProductRowProps) {
    const name = product.stocked ? (
        product.name
    ) : (
        <span style={{ color: "red" }}>{product.name} </span>
    );
    return (
        <tr>
            <td>{name}</td>
            <td>{product.price}</td>
        </tr>
    );
}

function ProdctTable({ products, filterText, inStockOnly }: ProductTableProps) {
    const rows: any[] = [];
    let lastCategory: string | null = null;

    products.forEach((product) => {
        if (
            product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1
        ) {
            return;
        }
        if (inStockOnly && !product.stocked) {
            return;
        }

        if (product.category !== lastCategory) {
            rows.push(
                <ProductCategoryRow
                    category={product.category}
                    key={product.category}
                />
            );
        }
        rows.push(<ProductRow product={product} key={product.name} />);
        lastCategory = product.category;
    });
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        </>
    );
}

function FilterableProductTable({ products }: FilterableProductTableProps) {
    const [filterText, setFilterText] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <SearchBar
                        filterText={filterText}
                        inStockOnly={inStockOnly}
                        onFilterTextChange={setFilterText}
                        onInStockOnlyChange={setInStockOnly}
                    />
                    <ProdctTable
                        products={products}
                        filterText={filterText}
                        inStockOnly={inStockOnly}
                    />
                </div>
            </div>
        </>
    );
}

export default FilterableProductTable;
