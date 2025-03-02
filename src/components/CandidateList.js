import React, { useState, useEffect } from "react";
import { searchCandidates } from "../services/api";
import { TextField, List, ListItem, Typography } from "@mui/material";

const CandidateList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        if (searchQuery) {
            searchCandidates(searchQuery).then(res => setCandidates(res.data));
        }
    }, [searchQuery]);

    return (
        <div>
            <TextField
                label="Search Candidates"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <List>
                {candidates.map(c => (
                    <ListItem key={c.id}>{c.name} - {c.skills}</ListItem>
                ))}
            </List>
        </div>
    );
};

export default CandidateList;
