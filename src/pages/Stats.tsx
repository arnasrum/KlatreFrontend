'use client';

import React, {useState} from 'react';
import {useStats} from "../hooks/useStats";
import {Bar, BarChart, Legend, XAxis, YAxis} from "recharts";
import {Checkbox, Input} from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import Modal from "../components/Modal.tsx";
import UserStats from "../interfaces/UserStats.ts";

type CounterStat = "totalTried" | "totalCompleted" | "routesTried";


type StatsProps = {
    groupId: number;
}

function Stats({groupId}: StatsProps) {

    const dateNow = new Date();
    const { userStats, refetchStats } = useStats({autoLoad: true, groupId: groupId});
    const [displayStats, setDisplayStats] = useState<CounterStat[]>([]);
    const [trimToData, setTrimToData] = useState(false);
    const [year, setYear] = useState(dateNow.getFullYear());
    const [month, setMonth] = useState(dateNow.getMonth() + 1);

    const statType = [
        {"label": "Total Tries", "value": "totalTries"},
        {"label": "Total Sends", "value": "totalCompleted"},
        {"label": "Routes Tried", "value": "routesTried"},
    ]

    const range = (start: number, end: number, step: number) => {
        if(step <= 0) {
            throw new Error("Step must be greater than 0");
        }
        const range: number[] = new Array(Math.ceil((end - start) / step));
        let value = start;
        for(let i = 0; i < range.length; i++) {
            range[i] = value;
            value += step;
        }
        return range;
    }
    function handleStats(rawStats: UserStats[], timeAggregate: string, year: number, month: number): UserStats[] {

        const dayInRange = new Date(year, month, 0).getDate();
        const dayRange = range(1, dayInRange + 1, 1);
        return dayRange.map(day => {
            const relevantStats = rawStats.filter(stat => stat.year == year && stat.month == month && stat.day == day)
            if(relevantStats.length == 0) {
                return {
                    groupId: groupId,
                    userId: 0,
                    year: year,
                    month: month,
                    day: day,
                    totalTries: 0,
                    totalCompleted: 0,
                    routesTried: 0,
                }
            } else {
                return relevantStats.reduce((prev, current): UserStats => {
                    return {
                        year: year, month: month, day: day,
                        groupId: groupId, userId: 0,
                        totalTries: prev.totalTries + current.totalTries,
                        totalCompleted: prev.totalCompleted + current.totalCompleted,
                        routesTried: prev.routesTried + current.routesTried
                    }
                })
            }
        })
    }

    function handleTickCount(stats: UserStats[], statLabels: string[]) {
        const tickCount = stats.reduce((prev, current) => {
            return {
                totalTries: Math.max(prev.totalTries, current.totalTries),
                totalCompleted: Math.max(prev.totalCompleted, current.totalCompleted),
                routesTried: Math.max(prev.routesTried, current.routesTried)
            }
        }, {totalTries: 0, totalCompleted: 0, routesTried: 0})
        return Math.max(...statLabels.map(label => tickCount[label as keyof typeof tickCount]))
    }

    const colors = {"routesTried": "red", "totalCompleted": "green", "totalTries": "blue"}

    return (
        <div>
            <SelectField label={"Display Stats:"} fields={statType} value={displayStats} setValue={setDisplayStats} width={"100%"} multiple />
            <Input
                value={year}
                onChange={(event) => setYear(Number(event.currentTarget.value))}
                type="number"
            />
            <Input
                value={month}
                onChange={(event) => setMonth(Number(event.currentTarget.value))}
                type="number"
                min={1}
                max={12}
            />

            {userStats && (
                <div>
                    <BarChart
                        width={"100%"}
                        height={500}
                        data={handleStats(userStats, "month", year, month)}
                        barSize={50}
                        responsive
                    >
                        <Legend/>
                        <XAxis
                            dataKey={"day"}
                            label={{ position: 'insideBottomRight', value: 'Date', offset: -5 }}
                        />
                        <YAxis label={{ position: 'insideTopLeft', value: 'Count', angle: -90, dy: 60 }}
                               allowDecimals={false}
                               domain={[0, handleTickCount(handleStats(userStats, "month", year, month), displayStats)]}
                               tickCount={handleTickCount(handleStats(userStats, "month", year, month), displayStats)}

                        />
                        {displayStats.map(statLabel =>
                            <Bar key={crypto.randomUUID()} dataKey={statLabel} fill={colors[statLabel]}/>
                        )}
                </BarChart>
            </div>

        )}
        </div>
    );
}

export default Stats;