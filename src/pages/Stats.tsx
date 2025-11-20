'use client';

import React, {useState, useMemo} from 'react';
import {useStats} from "../hooks/useStats";
import {
    Bar,
    BarChart,
    Legend,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    CartesianGrid
} from "recharts";
import {Input, Box, HStack, Text} from "@chakra-ui/react";
import SelectField from "../components/SelectField";
import UserStats from "../interfaces/UserStats.ts";

type CounterStat = "totalTries" | "totalCompleted" | "routesTried";


type StatsProps = {
    groupId: number;
}

function Stats({groupId}: StatsProps) {

    const dateNow = new Date();
    const { userStats } = useStats({autoLoad: true, groupId: groupId});
    const [displayStats, setDisplayStats] = useState<CounterStat[]>([]);
    const [year, setYear] = useState(dateNow.getFullYear());
    const [month, setMonth] = useState(dateNow.getMonth() + 1);
    const [monthTest, setMonthTest] = useState<string[]>([dateNow.getMonth() + 1 + ""]);

    const statType: { label: string, value: CounterStat }[] = [
        {"label": "Total Tries", "value": "totalTries"},
        {"label": "Total Completed", "value": "totalCompleted"},
        {"label": "Routes Tried", "value": "routesTried"},
    ]

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    const monthFields = months.map((monthLabel, index) => (
        {label: monthLabel, value:  (index + 1).toString()})
    );

    const range = (start: number, end: number, step: number) => {
        if(step <= 0) {
            throw new Error("Step must be greater than 0");
        }
        const result: number[] = [];
        for(let i = start; i < end; i += step) {
            result.push(i);
        }
        return result;
    }

    const handleStats = (rawStats: UserStats[] | undefined, year: number, month: number): UserStats[] => {
        if (!rawStats) return [];

        const dayInRange = new Date(year, month, 0).getDate();
        const dayRange = range(1, dayInRange + 1, 1);

        return dayRange.map(day => {
            // Filter and sum stats for the current day
            const relevantStats = rawStats.filter(stat =>
                stat.year === year &&
                stat.month === month &&
                stat.day === day
            );

            if (relevantStats.length === 0) {
                // Return zero-filled stat for days with no data
                return {
                    groupId: groupId,
                    userId: 0,
                    year: year,
                    month: month,
                    day: day,
                    totalTries: 0,
                    totalCompleted: 0,
                    routesTried: 0,
                } as UserStats;
            } else {
                return relevantStats.reduce((prev, current): UserStats => {
                    return {
                        ...prev, // Keep year, month, day, groupId, userId
                        totalTries: prev.totalTries + current.totalTries,
                        totalCompleted: prev.totalCompleted + current.totalCompleted,
                        routesTried: prev.routesTried + current.routesTried
                    } as UserStats;
                }, { // Initial accumulator structure (Day-specific data is irrelevant in initial reduce state)
                    groupId: groupId, userId: 0, year: year, month: month, day: day,
                    totalTries: 0, totalCompleted: 0, routesTried: 0,
                });
            }
        });
    }

    // Use useMemo to calculate the data only when userStats, year, or month changes
    const chartData = useMemo(() =>
            handleStats(userStats, year, month),
        [userStats, year, month]
    );


    function getMaxStatValue(stats: UserStats[], statLabels: CounterStat[]): number {
        if (statLabels.length === 0 || stats.length === 0) return 1; // Default min max value

        const maxVal = stats.reduce((prevMax, current) => {
            const currentDayMax = statLabels.reduce((dayMax, label) => {
                const value = current[label as keyof UserStats] as number;
                return Math.max(dayMax, value);
            }, 0);
            return Math.max(prevMax, currentDayMax);
        }, 0);

        // Add a small buffer and ensure it's at least 1
        return Math.max(1, maxVal + Math.ceil(maxVal * 0.1));
    }

    const yAxisDomainMax = useMemo(() =>
            getMaxStatValue(chartData, displayStats),
        [chartData, displayStats]
    );


    const colors: Record<CounterStat, string> = {
        "routesTried": "red",
        "totalCompleted": "green",
        "totalTries": "blue"
    }

    type TooltipPayload = {name: string, value: string | number, dataKey: string, color: string}
    type Tooltip = { active?: boolean, payload?: TooltipPayload[], label?: string | number }



    const CustomTooltip = ({ active, payload, label }: Tooltip) => {
        if (active && payload && payload.length) {
            return (
                <Box p={3} bg="white" border="1px solid #ccc" borderRadius="md" shadow="lg">
                    <Text fontWeight="bold" mb={2}>Day: {label}</Text>
                    {payload.map((pld: TooltipPayload) => (
                        <Text key={pld.dataKey} color={pld.color}>
                            {pld.name}: {pld.value}
                        </Text>
                    ))}
                </Box>
            );
        }

        return null;
    };


    return (
        <Box p={4}>
            <Text fontSize="2xl" mb={4} fontWeight="bold">Monthly Group Stats</Text>

            <SelectField
                label={"Display Stats:"}
                fields={statType}
                value={displayStats}
                setValue={setDisplayStats}
                width="100%"
                multiple
            />

            <HStack gap={4} mt={4} mb={8}>
                <Box>
                    <Text mb={1} fontSize="sm">Year:</Text>
                    <Input
                        value={year}
                        onChange={(event) => setYear(Number(event.currentTarget.value))}
                        type="number"
                        min={2000}
                        max={dateNow.getFullYear()}
                        width="100px"
                        colorScheme="blue"
                    />
                </Box>
                <Box>
                    <Text mb={1} fontSize="sm">Month (1-12):</Text>
                    <Input
                        value={month}
                        onChange={(event) => setMonth(Number(event.currentTarget.value))}
                        type="number"
                        min={1}
                        max={12}
                        width="100px"
                        colorScheme="blue"
                    />
                    <SelectField
                        fields={monthFields}
                        value={monthTest}
                        setValue={setMonthTest}
                    />
                </Box>
            </HStack>

            {userStats && chartData.length > 0 && displayStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart
                        data={chartData}
                        barSize={20}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

                        <Legend verticalAlign="top" height={36}/>

                        <Tooltip content={<CustomTooltip />} />

                        <XAxis
                            dataKey={"day"}
                            label={{ position: 'bottom', value: 'Day of the Month', dy: 15 }}
                        />
                        <YAxis
                            label={{ position: 'left', value: 'Count', angle: -90, dx: -10 }}
                            allowDecimals={false}
                            domain={[0, yAxisDomainMax]} // Use memoized max value
                        />

                        {displayStats.map(statLabel =>
                            <Bar
                                key={statLabel}
                                dataKey={statLabel}
                                fill={colors[statLabel]}
                                name={statType.find(s => s.value === statLabel)?.label || statLabel}
                            />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <Box p={10} textAlign="center" bg="gray.50" borderRadius="md">
                    <Text fontWeight="medium">
                        {userStats ? "Please select at least one statistic to display." : "Loading statistics or no data available for the selected period."}
                    </Text>
                </Box>
            )}
        </Box>
    );
}

export default Stats;