"use client";

import React, { useState, useEffect } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

import useDateContext from "@/hooks/useDateContext";
import useMonth from "@/hooks/useMonth";
import type { resData } from "@/lib/types";
import { getMonthNumber, days } from "@/lib/utils";

import MonthCells from "./_components/MonthCells";

export default function Home() {
  const { getMonths } = useMonth();

  const { date, setDate } = useDateContext();
  const [slideDate, setSlideDate] = useState(date);
  const [monthsData, setMonthsData] = useState<resData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const currentMonthNumber = getMonthNumber(slideDate);
      const reqData = {
        monthNumber: currentMonthNumber,
        userId: "89eb1010-ca1e-414a-a3f2-3b35a994c4a6",
      };
      const resData = await getMonths(reqData);
      setMonthsData(resData.data);
    }
    fetchData();
  }, [slideDate.getMonth()]); // TODO: getMonths() -> useRef

  const handleSwipe = (from: number, to: number) => {
    if (from === to) {
      return;
    }

    if (from === 2 && to === 0) {
      // Next month - specical case
      setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
      setSlideDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 3));
      return;
    }

    if (from === 0 && to === 2) {
      // Previous month - special case
      setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
      setSlideDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 3));
      return;
    }

    if (from < to) {
      // Next month
      setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
      return;
    }

    if (from > to) {
      // Previous month
      setDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
      return;
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col bg-[#442B0D]">
        <div className="grid grid-cols-7" style={{ height: "6vh" }}>
          {days.map((ele, i) => (
            <div
              key={i}
              className="flex items-center justify-center border border-[#4E4743] text-sm text-gray-300"
            >
              {ele}
            </div>
          ))}
        </div>
        <Slide
          vertical
          autoplay={false}
          arrows={false}
          canSwipe={true}
          onStartChange={(from: number, to: number) => handleSwipe(from, to)}
          defaultIndex={1}
        >
          <MonthCells // previous month: 0
            firstDayOfMonth={
              new Date(slideDate.getFullYear(), slideDate.getMonth() - 1, 1)
            }
            lastDayOfMonth={
              new Date(slideDate.getFullYear(), slideDate.getMonth(), 0)
            }
            monthData={
              monthsData ? monthsData[getMonthNumber(slideDate) - 1] : null
            }
          />
          <MonthCells // current month: 1
            firstDayOfMonth={
              new Date(slideDate.getFullYear(), slideDate.getMonth(), 1)
            }
            lastDayOfMonth={
              new Date(slideDate.getFullYear(), slideDate.getMonth() + 1, 0)
            }
            monthData={
              monthsData ? monthsData[getMonthNumber(slideDate)] : null
            }
          />
          <MonthCells // next month: 2
            firstDayOfMonth={
              new Date(slideDate.getFullYear(), slideDate.getMonth() + 1, 1)
            }
            lastDayOfMonth={
              new Date(slideDate.getFullYear(), slideDate.getMonth() + 2, 0)
            }
            monthData={
              monthsData ? monthsData[getMonthNumber(slideDate) + 1] : null
            }
          />
        </Slide>
      </div>
    </>
  );
}
