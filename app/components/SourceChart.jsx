// "use client"

// import * as React from "react"
// import { TrendingUp } from "lucide-react"
// import { Label, Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 190, fill: "var(--color-other)" },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Safari",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Edge",
//     color: "hsl(var(--chart-4))",
//   },
//   other: {
//     label: "Other",
//     color: "hsl(var(--chart-5))",
//   },
// }

// export default function SourceChart() {
//   const totalVisitors = React.useMemo(() => {
//     return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
//   }, [])

//   return (
//     <Card className="flex flex-col schart rounded-md">
//       <CardContent className="flex-1 pb-0">
//         <div className="h-14"></div>
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={chartData}
//               dataKey="visitors"
//               nameKey="browser"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {totalVisitors.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Visitors
//                         </tspan>
//                       </text>
//                     )
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }


// "use client";

// import { TrendingUp } from "lucide-react"
// import { Label, Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import { useEffect, useState } from "react";

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
// };

// export default function SourceChart({ visits }) {
//   const [chartData, setChartData] = useState([]);

//   // Function to group and process the top 4 sources
//   const processChartData = (visits) => {
//     const groupedPageSources = {};

//     // Count visitors for each source
//     visits.forEach(({ source }) => {
//       groupedPageSources[source] = (groupedPageSources[source] || 0) + 1;
//     });

//     // Sort sources by visitors in descending order
//     const sortedSources = Object.entries(groupedPageSources)
//       .map(([source, visitors]) => ({ source, visitors }))
//       .sort((a, b) => b.visitors - a.visitors);

//     // Take the top 4 sources
//     const topFourSources = sortedSources.slice(0, 4);

//     // Calculate the "Others" category
//     const othersVisitors = sortedSources
//       .slice(4)
//       .reduce((acc, curr) => acc + curr.visitors, 0);

   
//     topFourSources.push({ source: "Others", visitors: othersVisitors });


//     // Assign dynamic colors
//     return topFourSources.map((data, index) => ({
//       ...data,
//       fill: `hsl(var(--chart-${index + 1}))`,
//     }));
//   };

//   // Update chart data whenever `visits` changes
//   useEffect(() => {
//     setChartData(processChartData(visits));
//   }, [visits]);

//   // Calculate the total visitors
//   const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

//   return (
//     <Card className="flex flex-col schart rounded-md">
//       <CardContent className="flex-1 pb-0">
//         <div className="h-14"></div>
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={chartData}
//               dataKey="visitors"
//               nameKey="source"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-3xl font-bold"
//                         >
//                           {totalVisitors.toLocaleString()}
//                         </tspan>
//                         <tspan
//                           x={viewBox.cx}
//                           y={(viewBox.cy || 0) + 24}
//                           className="fill-muted-foreground"
//                         >
//                           Sources
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }


"use client";

import { Label, Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
};

export default function SourceChart({ visits }) {
  const [chartData, setChartData] = useState([]);

  const processChartData = (visits) => {
    const groupedPageSources = {};

    visits.forEach(({ source }) => {
      groupedPageSources[source] = (groupedPageSources[source] || 0) + 1;
    });

    const sourcesArray = Object.entries(groupedPageSources).map(
      ([source, visitors]) => ({ source, visitors })
    );

    const sortedSources = sourcesArray.sort((a, b) => b.visitors - a.visitors);

    const topFourSources = sortedSources.slice(0, 4);

    const othersVisitors = sortedSources
      .slice(4)
      .reduce((acc, curr) => acc + curr.visitors, 0);

    if (othersVisitors > 0) {
      topFourSources.push({ source: "Others", visitors: othersVisitors });
    }

    return topFourSources.map((data, index) => ({
      ...data,
      fill: `hsl(var(--chart-${index + 1}))`,
    }));
  };

  useEffect(() => {
    setChartData(processChartData(visits));
  }, [visits]);

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.visitors, 0);

  return (
    <Card className="flex flex-col schart rounded-md border-none bg-black">
      <CardContent className="flex-1 pb-0">
        <div className="h-14"></div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="source"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData.length.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Sources
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

