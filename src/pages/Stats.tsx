'use client';

import React, {useState} from 'react';
import {useStats} from "../hooks/useStats";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { VStack, Checkbox, Input } from "@chakra-ui/react";
import SelectField from "../components/SelectField";


type StatsProps = {
    groupId: number;
}

function Stats({groupId}: StatsProps) {

    const { userStats, refetchStats } = useStats({autoLoad: true, groupId: groupId});
    const [trimToData, setTrimToData] = useState(false);
    const [displayMode, setDisplayMode] = useState<string>("year");
    const [year, setYear] = useState(2024);
    const [month, setMonth] = useState(1);

    const selectFields = [
        {"label": "Year", "value": "year"},
        {"label": "Month", "value": "month"},
        {"label": "Day", "value": "day"},
    ]

    function handleStats(stats: object[]) {
        if(displayMode === "year") {

        }
    }

    console.log("userStats", userStats);
    console.log(`trim: ${trimToData}, year: ${year}, month: ${month}, displayMode: ${displayMode}`);
    return (
        <div>
            <Checkbox.Root>
                <Checkbox.HiddenInput
                    onChange={
                        (event) => setTrimToData(event.target.checked)}
                    checked={trimToData}
                />
                <Checkbox.Control/>
                <Checkbox.Label>Trim to data</Checkbox.Label>
                <SelectField fields={selectFields} value={displayMode} setValue={setDisplayMode} width={"100%"}/>
            </Checkbox.Root>
            <Input value={year} onChange={(event) => setYear(event.currentTarget.value)}></Input>
            <Input value={month} onChange={(event) => setMonth(event.currentTarget.value)}></Input>
            {userStats && (
                <div>
                    <BarChart width={600} height={500} data={userStats}>
                        <XAxis
                            dataKey="date"
                            label={{ position: 'insideBottomRight', value: 'Date', offset: -5 }}
                        />
                        <YAxis label={{ position: 'insideTopLeft', value: '?', angle: -90, dy: 60 }} />
                        <Bar dataKey="totalTries" fill="#8884d8" />
                    </BarChart>
                </div>

            )}
        </div>
    );
}

export default Stats;