"use client"

import Header from "@/app/components/Header";
import PageViewChart from "@/app/components/PageViewChart";
import Snippet from "@/app/components/Snippet";
import SourceChart from "@/app/components/SourceChart";
import TopPagesChart from "@/app/components/TopPagesChart";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import VisitorChart, { createVisitorChartData } from "@/app/components/VisitorChart";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/config/supabaseConfig";
import useUser from "@/hooks/useUser";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageWrapper from "@/app/components/PageWrapper";

export default function WebsitePage() {
  const [user] = useUser();
  const { website } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageViews, setPageViews] = useState([]);
  const [customEvents, setCustomEvents] = useState([]);
  const [totalVisits, setTotalVisits] = useState([]);
  const [groupedPageViews, setGroupedPageViews] = useState([]);
  const [groupedPageSources, setGroupedPageSources] = useState([]);
  const [groupedCustomEvents, setGroupedCustomEvents] = useState([]);
  const [activeCustomEventTab, setActiveCustomEventTab] = useState("");
  const [filterValue, setFilterValue] = useState(0);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "authenticated") router.push("/signin");
    const checkWebsiteCurrentUser = async () => {
      const { data, error } = await supabase
        .from("websites")
        .select()
        .eq("website_name", website)
        .eq("user_id", user.id);
      data.length == 0
        ? router.push("/dashboard")
        : setTimeout(() => {
          fetchViews();
        }, 500);
    };
    checkWebsiteCurrentUser();
  }, [user]);

  const fetchViews = async (filter_duration) => {
    setLoading(true);
    const ThatTimeAgo = new Date();
    if (filter_duration) {
      const onlyNumber_filter_duration = parseInt(
        filter_duration.match(/\d+/)[0]
      );
      ThatTimeAgo.setDate(ThatTimeAgo.getDate() - onlyNumber_filter_duration);
    }
    try {
      const [viewsResponse, visitsResponse, customEventsResponse] =
        filter_duration
          ? await Promise.all([
            supabase
              .from("page_views")
              .select()
              .eq("domain", website)
              .filter("created_at", "gte", ThatTimeAgo.toISOString()),
            supabase
              .from("visits")
              .select()
              .eq("website_id", website)
              .filter("created_at", "gte", ThatTimeAgo.toISOString()),
            supabase
              .from("events")
              .select()
              .eq("website_id", website)
              .filter("created_at", "gte", ThatTimeAgo.toISOString()),
          ])
          : await Promise.all([
            supabase.from("page_views").select().eq("domain", website),
            supabase.from("visits").select().eq("website_id", website),
            supabase.from("events").select().eq("website_id", website),
          ]);

      const views = viewsResponse.data;
      const visits = visitsResponse.data;
      const customEventsData = customEventsResponse.data;

      setPageViews(views);
      setGroupedPageViews(groupPageViews(views));
      setTotalVisits(visits);
      setGroupedPageSources(groupPageSources(visits));
      setCustomEvents(customEventsData);

      setGroupedCustomEvents(
        customEventsData.reduce((acc, event) => {
          acc[event.event_name] = (acc[event.event_name] || 0) + 1;
          return acc;
        }, {})
      );
    } catch (error) {
      console.error("Error fetching views:", error);
    } finally {
      setLoading(false);
    }
  };

  function groupPageViews(pageViews) {
    const groupedPageViews = {};
    pageViews.forEach(({ page }) => {
      const path = page.replace(/^(?:\/\/|[^/]+)*\//, "");

      groupedPageViews[path] = (groupedPageViews[path] || 0) + 1;
    });

    return Object.keys(groupedPageViews).map((page) => ({
      page: page,
      visits: groupedPageViews[page],
    }));
  }

  function groupPageSources(visits) {
    const groupedPageSources = {};

    visits.forEach(({ source }) => {
      groupedPageSources[source] = (groupedPageSources[source] || 0) + 1;
    });

    return Object.keys(groupedPageSources).map((source) => ({
      source: source,
      visits: groupedPageSources[source],
    }));
  }

  const formatTimeStampz = (date) => {
    const timestamp = new Date(date);

    const formattedTimestamp = timestamp.toLocaleString();
    return formattedTimestamp;
  };

  if (loading) {
    <PageWrapper>
      <Header />
      <div
        className="min-h-screen w-full items-center justify-center
         flex text-white relative"
      >
        loading...
      </div>
    </PageWrapper>
  }

  useEffect(() => {
    if (!supabase || !website) return;
    setInterval(() => {
      setFilterValue(0);
      fetchViews();
    }, 30000);
  }, [website, supabase]);

  return (
    <PageWrapper>
      <div className="bg-black text-white min-h-screen w-full items-center justify-center flex flex-col">
        <Header></Header>
        {pageViews?.length === 0 && !loading ? <div
          className="w-full items-center justify-center flex
         flex-col space-y-6 z-40 relative min-h-screen px-4"
        >
          <div
            className="z-40 w-full lg:w-2/3 bg-black border border-white/5 py-12 px-8 
        items-center justify-center flex flex-col text-white space-y-4 relative"
          >
            <p className="bg-green-600 rounded-full p-4 animate-pulse" />
            <p className="animate-pulse">waiting for the first page view</p>
            <button className="button" onClick={() => window.location.reload()}>
              refresh
            </button>
            <div className="w-full md:w-3/4 z-40 pb-6 border border-white/5 mt-12s">
              <Snippet />
            </div>
          </div>

        </div> :
          <div className="z-40 w-[95%] md:w-3/4 lg:w-2/3 min-h-screen py-6 border-x border border-white/5 items-center justify-start flex flex-col">
          <span className="text-white w-full items-center justify-end flex px-12 space-x-5">
          <Select
              onValueChange={(value) => {
                fetchViews(value);
                setFilterValue(value);
              }}
            >
              <SelectTrigger
                className="w-[180px] border border-white/5 
              outline-none hover:border-white/20 smooth"
              >
                <SelectValue
                  placeholder={filterValue ? filterValue : "lifetime"}
                  className="text-white"
                />
              </SelectTrigger>
              <SelectContent
                className="bg-black border
               border-white/10 bg-opacity-20 filter backdrop-blur-lg text-white"
              >
                <SelectItem className="filter_tab_item" value={0}>
                  LifeTime
                </SelectItem>
                <SelectItem className="filter_tab_item" value="last 7 days">
                  Last 7 days
                </SelectItem>
                <SelectItem className="filter_tab_item" value="last 30 days">
                  Last 30 days
                </SelectItem>
                <SelectItem className="filter_tab_item" value="last 60 days">
                  Last 60 days
                </SelectItem>
                <SelectItem className="filter_tab_item" value="last 90 days">
                  Last 90 days
                </SelectItem>
                <SelectItem className="filter_tab_item" value="last 180 days">
                  Last 180 days
                </SelectItem>
              </SelectContent>
            </Select>

            <ArrowPathIcon
              onClick={() => fetchViews()}
              className="h-4 w-4 stroke-white/60 hover:stroke-white smooth cursor-pointer z-50"
            />
          </span>
            <div className="w-full items-center justify-center">
              <Tabs defaultValue="general" className="w-full items-center justify-center flex flex-col">
                <TabsList className="w-full bg-transparent mb-4 items-start justify-start flex ">
                  <TabsTrigger value="general">general</TabsTrigger>
                  <TabsTrigger value="custom Events">custom Events</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="w-full">
                  <div className="w-full"></div>
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 px-4 gap-6">
                    <div className="bg-black border-white/5 border text-white text-center ">
                      <VisitorChart visitorsCount={totalVisits?.length}></VisitorChart>
                    </div>
                    <div className="bg-black border-white/5 border text-white text-center ">

                      <PageViewChart count={pageViews.length}></PageViewChart>

                    </div>
                  </div>

                  <div className="items-center justify-center grid grid-cols-1 bg-black lg:grid-cols-2 mt-12 w-full border-y border-white/5 ">
                    <div className="flex flex-col bg-black z-40 h-full w-full p-4">
                      <h3 className="label">Top Pages</h3>
                      <TopPagesChart pageviews={groupedPageViews}></TopPagesChart>
                    </div>
                    <div className="flex flex-col bg-black z-40 h-full w-full lg:border-l border-t lg:border-t-0 border-white/5 p-4">
                      <h4 className="label relative">
                        Top Visit Sources
                        <p className="absolute bottom-2 right-2 text-[10px] italic font-light">
                          add ?utm={"{source}"} to track
                        </p>
                      </h4>
                      <SourceChart visits={totalVisits}></SourceChart>
                    </div>
                  </div>

                </TabsContent>

                <TabsContent value="custom Events" className="w-full">
                  {groupedCustomEvents && (
                    <Carousel className="w-full px-4 dark">
                      <CarouselContent>
                        {Object.entries(groupedCustomEvents).map(([eventName, count], index) => (
                          <CarouselItem
                            key={eventName}
                            className="basis-1/2"
                          >
                            <div
                              className={`bg-black smooth group hover:border-white/10 text-white text-center border ${activeCustomEventTab === eventName
                                ? "border-white/10"
                                : "border-white/5 cursor-pointer"
                                }`}
                              onClick={() => setActiveCustomEventTab(eventName)}
                            >
                              <p
                                className={`text-white/70 font-medium py-8 w-full group-hover:border-white/10 smooth text-center border-b ${activeCustomEventTab === eventName
                                  ? "border-white/10"
                                  : "border-white/5 cursor-pointer"
                                  }`}
                              >
                                {eventName}
                              </p>
                              <p className="py-12 text-3xl lg:text-4xl font-bold bg-[#050505]">
                                {count}
                              </p>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}
                  <div
                    className="items-center justify-center bg-black mt-12 w-full border-y border-white/5 relative"
                  >
                    {activeCustomEventTab !== "" && (
                      <button
                        className="absolute right-0 z-50 bg-white text-black p-2 rounded"
                        onClick={() => setActiveCustomEventTab("")}
                      >
                        All
                      </button>
                    )}
                    <div className="flex flex-col bg-black z-40 h-full w-full">
                      {customEvents
                        .filter((item) =>
                          activeCustomEventTab
                            ? item.event_name === activeCustomEventTab
                            : item
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className="text-white w-full items-start justify-start px-6 py-12 border-b border-white/5 flex flex-col relative"
                          >
                            <p className="text-white/70 font-light pb-3">{event.event_name}</p>
                            <p>{event.message}</p>
                            <p className="italic absolute right-2 bottom-2 text-xs text-white/50">
                              {formatTimeStampz(event.timestamp)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </TabsContent>


              </Tabs>

            </div>

          </div>}

      </div>
    </PageWrapper>
  )
}