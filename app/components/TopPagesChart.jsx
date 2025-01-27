"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

export default function TopPagesChart({ pageviews }) {
    const [chartData, setChartData] = useState([]);
    const [chartConfig, setChartConfig] = useState({});

    useEffect(() => {
        if (pageviews) {
            const getLastSegment = (url) => {
                const parts = url.split("/");
                return parts
                    .reverse()
                    .find((segment) => isNaN(Number(segment))) || "";
            };

            const sortedPageviews = [...pageviews].sort((a, b) => b.visits - a.visits);

            const topPages = sortedPageviews.slice(0, 4);
            const otherPages = sortedPageviews.slice(4);
            const otherVisits = otherPages.reduce((sum, item) => sum + item.visits, 0);

            const formattedData = [
                ...topPages.map((item, index) => ({
                    page: `/${getLastSegment(item.page)}`,
                    visitors: item.visits,
                    fill: `hsl(var(--chart-${index + 1}))`,
                })),
                {
                    page: "Others",
                    visitors: otherVisits,
                    fill: "hsl(var(--chart-5))",
                },
            ];

            const dynamicConfig = topPages.reduce((config, item, index) => {
                const pageLabel = `/${getLastSegment(item.page)}`;
                config[pageLabel] = {
                    label: pageLabel,
                    color: `hsl(var(--chart-${index + 1}))`,
                };
                return config;
            }, {});

            dynamicConfig["Others"] = {
                label: "Others",
                color: "hsl(var(--chart-5))",
            };

            setChartData(formattedData);
            setChartConfig(dynamicConfig);
        }
    }, [pageviews]);

    return (
        <Card className="bchart rounded-md h-full bg-black border-none">
            <CardContent className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={chartData}
                            layout="horizontal"
                            margin={{
                                top: 25,
                                bottom: 0,
                            }}
                        >
                            <XAxis
                                dataKey="page"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                className="text-xs"
                            />
                            <YAxis dataKey="visitors" type="number" hide />

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar dataKey="visitors" layout="horizontal" radius={5}/>
                        </BarChart>
                    </ChartContainer>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
