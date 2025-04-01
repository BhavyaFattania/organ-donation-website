"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { motion } from "framer-motion"

// Sample data for charts
const organDonationData = [
  { name: "Kidney", value: 13426 },
  { name: "Liver", value: 4491 },
  { name: "Heart", value: 221 },
  { name: "Lung", value: 197 },
  { name: "Pancreas", value: 27 },
  { name: "Intestine", value: 16 },
]

const waitlistData = [
  { name: "Kidney", count: 90000 },
  { name: "Liver", count: 11000 },
  { name: "Heart", count: 3500 },
  { name: "Lung", count: 1100 },
  { name: "Kidney/Pancreas", count: 1800 },
  { name: "Pancreas", count: 900 },
]

const yearlyTrendsData = [
  { year: "2013", transplants: 4990, donors: 340 },
  { year: "2014", transplants: 6916, donors: 480 },
  { year: "2015", transplants: 8348, donors: 666 },
  { year: "2016", transplants: 9022, donors: 930 },
  { year: "2017", transplants: 9539, donors: 773 },
  { year: "2018", transplants: 10340, donors: 875 },
  { year: "2019", transplants: 12666, donors: 715 },
  { year: "2020", transplants: 7443, donors: 351 },
  { year: "2021", transplants: 12259, donors: 552 },
  { year: "2022", transplants: 16041, donors: 941 },
  { year: "2023", transplants: 18378, donors: 1099 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function DashboardSection() {
  const [region, setRegion] = useState("national")
  const [timeframe, setTimeframe] = useState("yearly")

  return (
    <section className="py-20 bg-muted/50" id="statistics">
      <div className="container px-4 md:px-6" >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Donation Statistics</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Real-time data and statistics on organ donation and transplantation
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="national">National</SelectItem>
              <SelectItem value="northeast">Northeast</SelectItem>
              <SelectItem value="midwest">Midwest</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="ml-auto">
            Download Report
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transplants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18,378</div>
                    <p className="text-xs text-muted-foreground">+14% from last year</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Registered Donors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">129,615</div>
                    <p className="text-xs text-muted-foreground">Less than 1% of Indian population</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Waiting List</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Up to 3 Lakhs</div>
                    <p className="text-xs text-muted-foreground">17 people die daily waiting</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Lives Saved</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">75+</div>
                    <p className="text-xs text-muted-foreground">Per donor (organs & tissue)</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Organ Donations by Type</CardTitle>
                  <CardDescription>Distribution of transplants by organ type in 2023</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[400px] w-full flex justify-center">
                    <ChartContainer config={{
                      value: {
                        label: "Transplants",
                        color: "#8884d8"
                      }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={organDonationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {organDonationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Number of Deceased Organ Donors 2023</CardTitle>
                  <CardDescription>Leading states in terms of Deceased Organ Donors  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ChartContainer config={{
                      value: {
                        label: "Transplants",
                        color: "#8884d8"
                      }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Tamil Nadu", value: 178 },
                            { name: "Telangana", value: 252 },
                            { name: "Karnataka", value: 178 },
                            { name: "Maharastha", value: 148 },
                            { name: "Gujarat", value: 146 },
                          ]}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" height={15} />
                          <YAxis type="category" dataKey="name" width={20} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="value" fill="#8884d8" barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>National Transplant Waiting List</CardTitle>
                <CardDescription>Current number of patients waiting by organ type</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[500px] w-full max-w-[950px] mx-auto px-4">
                  <ChartContainer config={{
                    value: {
                      label: "Transplants",
                      color: "#8884d8"
                    }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={waitlistData} margin={{ top: 10, right: 40, left: 30, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                          tickFormatter={(value) => `${value / 1000}K`}
                          tick={{ fontSize: 12 }}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Yearly Trends</CardTitle>
                <CardDescription>Transplants and donors over the past 11 years</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full max-w-[950px] mx-auto px-4">
                  <ChartContainer config={{
                    value: {
                      label: "Transplants",
                      color: "#8884d8"
                    }
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={yearlyTrendsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value / 1000}K`}
                          tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="transplants" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="donors" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

