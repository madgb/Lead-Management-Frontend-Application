"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import styles from "./admin.module.css";

interface Lead {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: "PENDING" | "REACHED_OUT";
    citizenship: string;
    createdAt: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const leadsPerPage = 8;
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Lead; direction: "asc" | "desc" } | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            const response = await fetch("/api/auth", { credentials: "include" });
            if (response.status === 401) {
                router.push("/login");
            } else {
                setIsAuthenticated(true);
            }
        }
        checkAuth();
    }, [router]);

    useEffect(() => {
        async function fetchLeads() {
            const response = await fetch("/api/leads", { credentials: "include" });
            if (!response.ok) throw new Error("Failed to fetch leads");
            const data: Lead[] = await response.json();
            setLeads(data);
            setFilteredLeads(data);
        }
        if (isAuthenticated) {
            fetchLeads();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let updatedLeads = [...leads];

        if (searchQuery) {
            updatedLeads = updatedLeads.filter(
                (lead) =>
                    lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter) {
            updatedLeads = updatedLeads.filter((lead) => lead.status === statusFilter);
        }

        if (sortConfig !== null) {
            updatedLeads.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }

        setFilteredLeads(updatedLeads);
    }, [searchQuery, statusFilter, sortConfig, leads]);

    const handleSort = (key: keyof Lead) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const updateLeadStatus = async (id: string) => {
        try {
            const response = await fetch(`/api/leads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "REACHED_OUT" }),
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to update lead status");

            setLeads((prevLeads) =>
                prevLeads.map((lead) =>
                    lead.id === id ? { ...lead, status: "REACHED_OUT" } : lead
                )
            );
        } catch (error) {
            console.error("Error updating lead status:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", { method: "POST", credentials: "include" });

            if (!response.ok) {
                throw new Error("Failed to logout");
            }

            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (!isAuthenticated) {
        return <p>Redirecting to login...</p>;
    }

    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const pathname = usePathname();

    return (
        <div className={styles.container}>
            <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                    ☰
                </button>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
                <div>
                    <h1>almà</h1>
                    <div>
                        <a href="#" className={pathname === "/admin" ? styles.activeLink : ""}>Leads</a>
                        <a href="#">Settings</a>
                    </div>
                </div>
                <div>
                    <div className={styles.adminSection}>
                        <span>A</span>Admin
                    </div>
                    <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <h1>Leads</h1>

                <div className={styles.filterContainer}>
                    <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.selectWrapper}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="">Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="REACHED_OUT">Reached Out</option>
                        </select>
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("firstName")}>
                                Name {sortConfig?.key === "firstName" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th className={styles.desktopOnly} onClick={() => handleSort("createdAt")}>
                                Submitted {sortConfig?.key === "createdAt" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th onClick={() => handleSort("status")}>
                                Status {sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th onClick={() => handleSort("citizenship")}>
                                Country {sortConfig?.key === "citizenship" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                            </th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLeads.map((lead) => (
                            <tr key={lead.id}>
                                <td>{lead.firstName} {lead.lastName}</td>
                                <td className={styles.desktopOnly}>{new Date(lead.createdAt).toLocaleString()}</td>
                                <td>{lead.status}</td>
                                <td>{lead.citizenship || "N/A"}</td>
                                <td>
                                    {lead.status === "PENDING" ? (
                                        <button
                                            className={styles.statusButton}
                                            onClick={() => updateLeadStatus(lead.id)}
                                        >
                                            Mark as Reached Out
                                        </button>
                                    ) : (
                                        "Completed"
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className={styles.pagination}>
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    {[...Array(Math.ceil(filteredLeads.length / leadsPerPage))].map((_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? styles.activePage : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredLeads.length / leadsPerPage)}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
}
