import { Outlet } from "react-router-dom";
export default function Root() {
    return (
        <>
            <div id="sidebar">
                <h1>Combinations System</h1>
                <nav>
                    <ul>
                        <li>
                            <a href={`/`}>Combinations</a>
                        </li>
                        <li>
                            <a href={`/logs`}>Logs</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}
